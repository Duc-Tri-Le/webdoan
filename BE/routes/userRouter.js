import express from "express"
import { loginUSer, registerUSer } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUSer)
userRouter.post("/login", loginUSer)

export default userRouter