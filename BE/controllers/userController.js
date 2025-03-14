import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Hàm tạo token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

// Đăng nhập người dùng
const loginUSer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm người dùng trong database
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "Tài khoản không tồn tại!" });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Sai mật khẩu!" });
        }

        // Tạo token đăng nhập
        const token = createToken(user._id);

        // Loại bỏ mật khẩu khỏi dữ liệu trả về
        const { password: _, ...userData } = user._doc;

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            data: { user: userData, token },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
};

// Đăng ký người dùng
const registerUSer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại!" });
        }

        // Kiểm tra email hợp lệ
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Email không hợp lệ!" });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự!" });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tạo user mới
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        // Lưu user vào database
        await user.save();

        // Tạo token
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công!",
            data: { id: user._id, name: user.name, email: user.email, token },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
};

export { loginUSer, registerUSer };
