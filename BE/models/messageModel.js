import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["text", "image", "mixed"],
      required: true,
    },
    fromUser:{
      type:Boolean,
    },
    tempId:{
      type:String,
    }
  },
  { timestamps: true }
);

const Message = mongoose.models.message || mongoose.model("message", messageSchema);

export  {Message}; 