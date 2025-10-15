import bcrypt from "bcryptjs";
import USER from "../models/usermodels.js";
import { genarateToken } from "../lib/genaratetoken.js";
import cloudinary from "../lib/cloudinary.js";
export async function signup(req, res) {
    const { fullname, email, password } = req.body
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        const existinguser = await USER.findOne({ email })
        if (existinguser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const user = await USER.create({
            fullname,
            email,
            password: passwordHash,
        })
        const token = genarateToken(user._id, res);
        const { password: _, ...safeUser } = user.toObject();
        res.status(200).json({ success: true, message: "User created successfully", token, user: safeUser })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })

    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // ✅ Generate JWT & Set cookie
        const token = genarateToken(user._id, res);

        // ✅ Remove password before sending user data
        const { password: _, ...safeUser } = user.toObject();

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: safeUser,
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function logout(req, res) {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user._id;
        const { pic } = req.body;

        // ✅ Initialize an object for updates
        const updateData = {};

        // ✅ If pic (Base64) exists, upload to Cloudinary
        if (pic && pic.startsWith("data:image")) {
            const uploaded = await cloudinary.uploader.upload(pic, {
                folder: "user_profiles",
                resource_type: "image",
            });

            updateData.pic = uploaded.secure_url; // ✅ store Cloudinary URL
        }

        // ✅ Ensure we have something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided to update",
            });
        }

        // ✅ Update user document
        const updatedUser = await USER.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}


export async function checkAuth(req, res) {
    try {
        res.status(200).json({ success: true, message: "User is authenticated", user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
    }
}