import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" , required: true }, // 🔥 Fix ref: "user"
    item: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
            quantity: { type: Number, default: 1 },
          }
    ] 
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);
export default cartModel;
