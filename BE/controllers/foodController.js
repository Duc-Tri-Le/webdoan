import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// add food
const addFood = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const image_URL = req.file ? `images/${req.file.filename}` : null;
    const { name, description, price, category } = req.body;

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: image_URL,
    });

    await food.save();
    res
      .status(201)
      .json({ success: true, message: "Food added successfully", data: food });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// list food
const list_food = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
};

// remove food
const remove_food = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy món ăn!" });
    }

    // Xóa ảnh nếu có
    if (food.image) {
      const imagePath = path.join("uploads", path.basename(food.image));
      console.log(`Đường dẫn ảnh cần xóa: ${imagePath}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Ảnh ${food.image} đã bị xóa!`);
      } else {
        console.log(`Ảnh ${food.image} không tồn tại!`);
      }
    }

    await foodModel.findByIdAndDelete(foodId);
    return res
      .status(200)
      .json({ success: true, message: "Xóa món ăn thành công!", data: food });
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Lỗi server. Vui lòng thử lại!" });
  }
};

// detail food
const detail_food = async (req, res) => {
  try {
    const foodId = req.params.id;
    const detail = await foodModel.findById(foodId);
    if (!detail) {
      return res
        .status(404)
        .json({ success: false, message: "Món ăn không tồn tại!" });
    }
    res.json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// update food
const update_food = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy món ăn!" });
    }

    let image_URL = food.image;
    const { name, price, description, category } = req.body;
    const file_image = req.file;

    // Nếu có ảnh mới, xóa ảnh cũ trước khi cập nhật
    if (file_image) {
      if (food.image) {
        const oldImagePath = path.join("uploads", path.basename(food.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_URL = `/images/${file_image.filename}`;
    }

    // Cập nhật thông tin
    food.name = name;
    food.price = price;
    food.description = description;
    food.category = category;
    food.image = image_URL;

    await food.save();
    res
      .status(200)
      .json({ success: true, message: "Cập nhật thành công!", data: food });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

export { addFood, list_food, remove_food, update_food, detail_food };
