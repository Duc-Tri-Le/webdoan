import express from "express";
import {
  getUserIf,
  loginUSer,
  registerUSer,
  updateUSer,
  loginStaff,
  grantRole,
  createStaff,
  getListStaff,
  getAdmin,
  getAllUser
} from "../controllers/userController.js";
import { authMiddleware,authorizeRoles } from "../middleware/auth.js";

const userRouter = express.Router();
//user
userRouter.post("/register", registerUSer);
userRouter.post("/login", loginUSer);
userRouter.get("/getAdmin", getAdmin);
//staff
userRouter.post("/login/staff", loginStaff)
//admin
userRouter.patch("/grantRole/:id",authMiddleware,authorizeRoles("admin"), grantRole)
userRouter.post("/createStaff",authMiddleware, authorizeRoles('admin'), createStaff)
userRouter.get("/listStaff",authMiddleware,authorizeRoles("admin"), getListStaff)
userRouter.get("/listUser", authMiddleware, authorizeRoles('admin'), getAllUser)
//all
userRouter.patch("/update", authMiddleware, updateUSer);
userRouter.get("/getUserIf", authMiddleware, getUserIf);
export default userRouter;
