import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Hàm tạo token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// Đăng nhập người dùng
const loginUSer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Sai mật khẩu!" });
    }

    const token = createToken(user._id, user.role);

    // Loại bỏ mật khẩu khỏi dữ liệu trả về
    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      data: { user: userData, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server!", error: error.message });
  }
};

// Đăng ký người dùng
const registerUSer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không hợp lệ!" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = createToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server!", error: error.message });
  }
};

const updateUSer = async (req, res) => {
  try {
    const editData = req.body;
    const id = req.userId;

    const user = await userModel.findByIdAndUpdate(id, editData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getUserIf = async (req, res) => {
  try {
    const id = req.userId;
    const user = await userModel.findById(id);
    if (!user) {
      res.status(400).json({ success: false, message: "no user" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, errors: error });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await userModel.findOne({ email }).select("+password");
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại!" });
    }

    if (staff.role === "user") {
      return res.status(400).json({ success: false, message: "ko co quyen" });
    }
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Sai mật khẩu!" });
    }

    const token = createToken(staff._id, staff.role);

    const { password: _, ...staffData } = staff._doc;
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      data: { staff: staffData, token },
    });
  } catch (error) {}
};

const grantRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id: staffId } = req.params;
    const adminId = req.userId;

    const admin = await userModel.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền!" });
    }

    const user = await userModel.findById(staffId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại!" });
    }

    user.role = role;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Cập nhật quyền thành công!", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server!", error });
  }
};

const createStaff = async (req, res) => {
  try {
    const { email, name, password, role, mnv } = req.body;

    const staffExist = await userModel.findOne({ email });
    if (staffExist) {
      return res.status(400).json({ success: false, message: "Nhân viên đã tồn tại" });
    }


    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Email không hợp lệ!" });
    }

  
    if (!mnv || mnv.length < 3) {
      return res.status(400).json({ success: false, message: "Mã nhân viên không hợp lệ!" });
    }

  
    const passwordHash = await bcrypt.hash(password, 10);

    const newStaff = new userModel({
      name,
      email,
      password: passwordHash,
      role,
      mnv,
    });

    await newStaff.save();

    return res.status(201).json({
      success: true,
      message: "Tạo nhân viên thành công!",
      data: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        mnv: newStaff.mnv,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
  }
};


const getListStaff = async (req, res) => {
  try {
    const staff = await userModel.find({ role: { $in: ["shipper", "seller"] } });

    if (staff.length === 0) {
      return res.status(400).json({ success: false, message: "Không có nhân viên nào" });
    }

    return res.status(200).json({ success: true, data: staff });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    res.status(500).json({ success: false, errors: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await userModel.findOne({role:"admin"})
    if(!admin){
      return res.status(404).json({message:"no found"})
    }
    return res.status(200).json(admin)
  } catch (error) {
    return res.status(500).json({message:"error", error:error})
  }
}
const getAllUser = async(req, res) => {
  try {
    const listUser = await userModel.find({});
    return res.status(200).json({message:"lay thanh cong", data:listUser})
  } catch (error) {
    return res.status(500).json({error:error})
  }
}


export {
  loginUSer,
  registerUSer,
  updateUSer,
  getUserIf,
  loginStaff,
  grantRole,
  createStaff,
  getListStaff,
  getAdmin,
  getAllUser,
};
