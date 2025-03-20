import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "no-image.png" },
    category: { type: String, required: true },
    reviews: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        text: { type: String, default: "" }, // Nội dung review
        date: { type: Date, default: Date.now }, // Thời gian tạo
      },
    ],
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
