import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
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
      text: { type: String, default: "" },
      date: { type: Date, default: Date.now },
      rating_review: { type: Number, default: 5 },
    },
  ],
  rating: { type: Number, default: 5 },
  created_at: { type: String, default: null },
  updated_at: { type: String, default: null },
  isRecommended: { type: Boolean, default:false },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
