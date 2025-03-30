import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const mongooseURl =
  "mongodb+srv://triduc2k3:ncYtwkfZXAvYgl8y@cluster0.ce37x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const createAdminAccount = async () => {
  try {
    const existAdmin = await userModel.findOne({ role: "admin" });
    if (existAdmin) {
      console.log("admin da co");
      return;
    }

    const hashPassword = await bcrypt.hash("admin", 10);
    const admin = new userModel({
      name: "admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role : "admin"
    });

    await admin.save();
    console.log("Tài khoản Admin mặc định đã được tạo!");
  } catch (error) {
    console.error("Lỗi khi tạo admin:", error);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongooseURl, { useNewUrlParser: true, useUnifiedTopology: true });
    await createAdminAccount()
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

export { connectDB };
