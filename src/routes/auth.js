import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/authcontroller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login",login)
router.post("/logout",logout)

router.put("/update-profile",isAuthenticated,updateProfile)
router.get("/check-auth",isAuthenticated,checkAuth)

export default router