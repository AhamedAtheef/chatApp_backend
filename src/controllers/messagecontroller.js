import MESSAGE from "../models/messagemodel.js";
import cloudinary from "../lib/cloudinary.js";
import USER from "../models/usermodels.js";
import { getReceiver, io } from "../middleware/socket.js";

export async function getUsersForsidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;
        const fillteredUsers = await USER.find({ _id: { $ne: loggedInUserId } })
            .select("-password")
        res.status(200).json({ success: true, users: fillteredUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getMessages(req, res) {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await MESSAGE.find({
            $or: [
                { senderId: userToChatId, receiverId: myId },
                { senderId: myId, receiverId: userToChatId },
            ],
        })

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
}


export async function sendMessage(req, res) {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        let imageUrl = "";
        if (image) {
            const uploaded = await cloudinary.uploader.upload(image);
            imageUrl = uploaded.secure_url;
        }

        //  Use the model MESSAGE
        const newMessage = new MESSAGE({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //send a notification to the receiver
        const receiverSocketId = getReceiver(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("Receiver Socket ID:", receiverSocketId);
        } else {
            console.log("Receiver Socket ID not found");
        }


        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}