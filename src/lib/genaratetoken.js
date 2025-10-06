import jwt from "jsonwebtoken";

export async function genarateToken(userId, res) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // optional: set JWT expiry
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}