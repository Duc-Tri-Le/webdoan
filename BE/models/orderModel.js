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
    item: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    review: [
      {
        text: { type: String, default: "" },
        date: { type: Date, default: Date.now },
      },
    ],
    delivery_fee: { type: Number, required: true },
    total_price: { type: Number, required: true },
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
        "waiting for",
        "on delivery",
        "shipped",
        "cancelled",
        "returned",
        "return request",
        "cancel request"
      ],
      default: "waiting for",
    },
    payment_status: { type: Boolean, default: false },
    payment_gateAway: { type: String, enum: ["MoMo", "vnPay", "stripe", ""] },
    payment_method: { type: String, enum: ["cod", "online"], required: true },
    order_create: { type: String, default: null },
    order_on_delivery: { type: String, default: null },
    order_shipped: { type: String, default: null },
    order_cancel: { type: String, default: null },
    order_return: { type: String, default: null },
    order_reviewed: { type: String, default: null },
    order_receive: { type: String, default: null },
    typePayment: { type: String, default: "card" },
    refund_id: { type: String, default: null },
    refund_amount: { type: Number, default: 0 }, 
    refund_status: {
      type: String,
      enum: ["pending", "succeeded", "failed", null],
      default: null,
    },
    // refund_reason: { type: String, default: "" },
    // refund_requested_at: { type: Date, default: null },
    // refund_processed_at: { type: Date, default: null },
    // cancel_reason: { type: String, default: "" },

    payment_intent: { type: String },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
