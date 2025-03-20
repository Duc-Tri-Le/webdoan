import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import UUID để tạo mã ngẫu nhiên

const orderSchema = new mongoose.Schema(
  {
    tracking_id: {
      type: String,
      unique: true,
      required: true,
      default: () => `ORD-${uuidv4().slice(0, 8)}`, // Tạo mã tự động
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    review:[{
      text: { type: String, default: "" }, // Nội dung review
      date: { type: Date, default: Date.now } // Thời gian tạo
    }],
    discount_code: { type: Number, default: 0 }, // % giảm giá
    total_price: { type: Number, default: 0 },
    delivery_fee: { type: Number, required: true },
    address: {
      first_name: String,
      last_name: String,
      street: String,
      city: String,
      state: String,
      zip_code: String,
      country: String,
      phone: String,
    },
    state: {
      type: String,
      enum: [
        "food processing",
        "on delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "food processing",
    },
    date: { type: Date, default: Date.now },
    payment_status: { type: Boolean, default: false },
    payment_id: { type: String }, // ID giao dịch từ Stripe hoặc cổng thanh toán khác
    payment_method: { type: String, enum: ["cod", "online"], required: true },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
