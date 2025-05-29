import React, { useContext, useEffect, useRef, useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { StoreContext } from "../../context/StoreContext.js";
import MessageInput from "./MessageInput.js";
import { UseSocket } from "../../config/socket.js";
import "./ChatBox.css";
import { v4 as uuidv4 } from "uuid";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [adminId, setAdminId] = useState("");
  const { URL, token, getAdmin, userId } = useContext(StoreContext);
  const socket = UseSocket(userId);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  //gui tin
  const handleSend = async ({ text, image }) => {
    if (!text.trim() && !image) return;

    const tempId = uuidv4();
    const newMessage = {
      tempId: tempId,
      text: text || "",
      image: image || "",
      timestamp: new Date(),
      type: text.trim() && image ? "mixed" : image ? "image" : "text",
      fromUser: true,
    };

    socket?.emit("sendMessage", {
      to: adminId,
      text: newMessage.text,
      image: newMessage.image,
      type: newMessage.type,
      fromUser: true,
      tempId: tempId,
    });

    setMessages((prev) => [...prev, newMessage]);
  };
  //nhan tin va xoa tn
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      const newMessage = {
        id: message.id,
        text: message.text || "",
        image: message.image || "",
        fromUser: message.fromUser,
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
        type: message.type,
        tempId: message.tempId,
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    const handleDelete = ({ tempId }) => {
      console.log("Đã nhận yêu cầu xóa message với tempId:", tempId);
      setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    };    

    socket.on("deletedMessage", handleDelete);
    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("deleteMessage", handleDelete);
    };
  }, [socket]);
  // lay tin nhan
  useEffect(() => {
    const getMessage = async () => {
      if (!isOpen) return;
      try {
        const admin = await getAdmin();
        setAdminId(admin);

        const res = await fetch(
          `${URL}/api/message/getMessages?onSelectUser=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        const formattedMessages = (
          Array.isArray(data.data) ? data.data : []
        ).map((msg) => ({
          id: msg._id,
          text: msg.text || "",
          image: msg.image || "",
          fromUser: msg.fromUser,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          type: msg.image && msg.text ? "mixed" : msg.image ? "image" : "text",
          tempId: msg.tempId || "",
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      }
    };

    getMessage();
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //xoa tin nhan
  const handleDeleteMessage = async (tempId) => {
    socket?.emit("deleteMessage", {
      receiveUser: adminId,
      tempId: tempId,
    });

    setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
  };

  if (!userId || !token) return null;

  return (
    <div className="chatbox-container">
      {!isOpen && (
        <button className="chatbox-toggle" onClick={() => setIsOpen(true)}>
          <FaComments size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <span>Hỗ trợ trực tuyến</span>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbox-message ${msg.fromUser ? "user" : "bot"}`}
              >
                {(msg.type === "text" || msg.type === "mixed") && msg.text && (
                  <span className="message-text">{msg.text}</span>
                )}
                {(msg.type === "image" || msg.type === "mixed") &&
                  msg.image && (
                    <img
                      src={msg.image}
                      alt="message-img"
                      className="chatbox-image"
                    />
                  )}
                {msg.fromUser && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMessage(msg.tempId)}
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chatbox-footer">
            <MessageInput onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
}
