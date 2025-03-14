import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
      enum: ["food processing", "shipped", "delivered", "cancelled", "returned"],
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
