import express from "express";
import {
  getUserIf,
  loginUSer,
  registerUSer,
  updateUSer,
  loginStaff,
  grantRole,
  createStaff,
  getListStaff
} from "../controllers/userController.js";
import { authMiddleware,authorizeRoles } from "../middleware/auth.js";

const userRouter = express.Router();
//user
userRouter.post("/register", registerUSer);
userRouter.post("/login", loginUSer);
//staff
userRouter.post("/login/staff", loginStaff)
//admin
userRouter.patch("/grantRole/:id", grantRole)
userRouter.post("/createStaff", createStaff)
userRouter.get("/listStaff", getListStaff)
//all
userRouter.patch("/update", authMiddleware, updateUSer);
userRouter.get("/getUserIf", authMiddleware, getUserIf);
export default userRouter;
