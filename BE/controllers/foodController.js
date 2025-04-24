import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import userModel from "../models/userModel.js";

// add food
const addFood = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.file);

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
    const foods = await foodModel.find({}).populate("reviews");
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
    const detail = await foodModel.findById(foodId).populate("reviews.user_id");
    if (!detail) {
      return res
        .status(404)
        .json({ success: false, message: "Món ăn không tồn tại!" });
    }
    res.json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
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
    console.log(req.body);
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
    // console.error("Lỗi chi tiết:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server!", error: error.message });
  }
};

const search_food = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.toLowerCase() : "";

    if (!search) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu tham số tìm kiếm!" });
    }
    const foodSearch = await foodModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });
    res.status(200).json({ success: true, data: foodSearch });
  } catch (error) {
    res.status(500).json({ success: false, errors: error });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, rating_food } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User không tồn tại!" });
    }
    const food = await foodModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            reviews: {
              user_id: userId,
              text: review,
              createdAt: new Date(),
              rating_review: rating_food,
            },
          },
        },
        { new: true }
      )
      .populate("reviews.user_id");

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Món ăn không tồn tại!" });
    }

    const totalRating = food.reviews.reduce((sum, review) => {
      return sum + review.rating_review;
    }, 0);
    const avgRating = (totalRating / food.reviews.length).toFixed(1);
    food.rating = avgRating;
    await food.save();

    res.status(200).json({ success: true, data: food });
  } catch (error) {
    console.error("Lỗi khi thêm đánh giá:", error);
    res.status(500).json({ success: false, message: "Lỗi server!", error });
  }
};

const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewId } = req.body;
    const food = foodModel
      .findByIdAndUpdate(
        id,
        {
          $pull: {
            reviews: { _id: reviewId },
          },
        },
        { new: true }
      )
      .populate("reviews.user_id");

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy món ăn!" });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server!", error });
  }
};

export {
  addFood,
  list_food,
  remove_food,
  update_food,
  detail_food,
  search_food,
  addReview,
};
