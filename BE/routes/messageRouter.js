import express from "express"
import {deleteMessage, getMessage } from "../controllers/messageController.js"
import { authMiddleware } from "../middleware/auth.js";

const messageRouter = express.Router()

messageRouter.get("/getMessages", authMiddleware, getMessage);
messageRouter.delete("/deleteMessage/:id",authMiddleware,deleteMessage);

export default messageRouter