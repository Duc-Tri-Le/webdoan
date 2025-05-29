import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  deleteMessage,
  patchMessage,
} from "../controllers/messageController.js";
import { log } from "console";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(" Server socket connected:", socket.id, "| UserId:", userId);

  // Ghi đè hoặc thêm userId vào map
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Cập nhật danh sách online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Xử lý gửi tin nhắns
  socket.on(
    "sendMessage",
    async ({ to, text, image, type, fromUser, tempId }) => {
      try {
        const senderId = userId;
        const receiverId = to;
        // Lưu tin nhắn vào database
        const savedMessage = await patchMessage(
          senderId,
          receiverId,
          text,
          image,
          type,
          fromUser,
          tempId
        );

        const receiverSocketId = userSocketMap[to];
        if (receiverSocketId) {
          //phat lenh nhan
          io.to(receiverSocketId).emit("receiveMessage", {
            id: savedMessage._id,
            text: savedMessage.text,
            image: savedMessage.image,
            type: savedMessage.type,
            senderId: { id: senderId },
            receiverId: { id: receiverId },
            timestamp: savedMessage.createdAt,
            fromUser: savedMessage.fromUser,
            tempId: savedMessage.tempId,
          });

          // io.to(receiverSocketId).emit("deleteMessage", tempId);
        }
      } catch (error) {
        console.error("Lỗi khi gửi hoặc lưu tin nhắn:", error);
        socket.emit("messageError", {
          message: "Không thể gửi tin nhắn",
          error: error.message,
        });
      }
    }
  );

  socket.on("deleteMessage", async ({ receiveUser, tempId }) => {
    try {
      const res = await deleteMessage(tempId);

      if (!res) {
        console.log("Không tìm thấy tin nhắn để xoá.");
        return;
      }
      io.to(userSocketMap[receiveUser]).emit("deletedMessage", {
        tempId: res.tempId,
      });
    } catch (error) {
      console.error("Lỗi khi xoá tin nhắn:", error);
    }
  });

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);

    // Tìm userId tương ứng để xóa
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
