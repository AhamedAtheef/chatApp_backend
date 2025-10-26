import jwt from "jsonwebtoken";

export async function genarateToken(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,       // ✅ Render uses HTTPS
    sameSite: "none",   // ✅ allow cross-origin cookies (localhost ↔ render)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}
