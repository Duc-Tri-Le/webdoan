import { Message } from "../models/messageModel.js";

export const patchMessage = async (
  senderId,
  receiverId,
  text,
  image,
  type,
  fromUser,
  tempId
) => {
  try {
    if (!senderId || !receiverId) {
      throw new Error("SenderId and ReceiverId are required");
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
      type,
      fromUser,
      tempId,
    });

    // Lưu tin nhắn
    const savedMessage = await newMessage.save();

    return savedMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const getMessage = async (req, res) => {
  try {
    let userId;
    userId = req.query.onSelectUser;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: 1 });

    return res
      .status(200)
      .json({ message: "danh sach tin nhan", data: messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({
      success: false,
      message: "Error getting messages",
      error: error.message,
    });
  }
};

export const deleteMessage = async (tempId) => {
  try {
    const deleted = await Message.findOneAndDelete({ tempId });
    return deleted; 
  } catch (error) {
    console.error("Error deleting message:", error);
    return null;
  }
};

