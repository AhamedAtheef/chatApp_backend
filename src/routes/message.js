import express from "express";
import { getMessages, getUsersForsidebar, sendMessage } from "../controllers/messagecontroller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/users",isAuthenticated, getUsersForsidebar)
messageRouter.get("/:id",isAuthenticated, getMessages)
messageRouter.post("/send/:id",isAuthenticated, sendMessage)



export default messageRouter