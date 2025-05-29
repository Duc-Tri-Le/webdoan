import React, { useContext, useEffect, useRef, useState } from "react";
import { UseSocket } from "../../config/socket.jsx";
import MessageInput from "./MessageInput.jsx";
import "./ChatBox.css";
import { StoreContext } from "../../StoreContext/StoreContext.jsx";
import SideBarChat from "./SideBarChat.jsx";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const { URL, token, userId, getAllUser } = useContext(StoreContext);
  const [allUser, setAllUser] = useState([]);
  const [onSelectUser, setOnSelectUser] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const socket = UseSocket(userId);
  const endRef = useRef(null);
  const isChatBox = query.isChatBox;
  const [listUserOnline, setListUserOnline] = useState([]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  //gui tin socket
  const handleSend = async ({ text, image }) => {
    if (!text.trim() && !image) return;
    if (!onSelectUser) {
      alert("Vui lòng chọn người để trò chuyện.");
      return;
    }
    const tempId = uuidv4();
    const newMessage = {
      tempId: tempId,
      text: text || "",
      image: image || "",
      timestamp: new Date(),
      type: text.trim() && image ? "mixed" : image ? "image" : "text",
      fromUser: false,
    };

    socket?.emit("sendMessage", {
      to: onSelectUser,
      text: newMessage.text,
      image: newMessage.image,
      type: newMessage.type,
      fromUser: false,
      tempId: tempId,
    });

    setMessages((prev) => [...prev, newMessage]);
  };
  //nhan tin socket
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      const newMessage = {
        id: message.id,
        text: message.text || "",
        image: message.image || "",
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
        type: message.type,
        fromUser: message.fromUser,
        tempId: message.tempId,
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleReceive);

    const handleGetUserOnline = (userIds) => {
      setListUserOnline(userIds);
    };

    const handleDelete = ({ tempId }) => {
      console.log("Đã nhận yêu cầu xóa message với tempId:", tempId);
      setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
    }; 

    socket.on("deletedMessage", handleDelete);

    socket.on("getOnlineUsers", handleGetUserOnline);
    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("getOnlineUsers", handleGetUserOnline);
      socket.off("deleteMessage", handleDelete);
    };
  }, [socket]);

  //lay danh sach nguoi dung
  useEffect(() => {
    if (!token) return;
    const fetchAllUser = async () => {
      try {
        const users = await getAllUser(token);
        setAllUser(users);
      } catch (err) {
        console.error("Lỗi lấy danh sách người dùng:", err);
      }
    };
    fetchAllUser();
  }, [isChatBox, token]);
  //lay tin nhan
  useEffect(() => {
    if (!token) return;
    const getMessage = async () => {
      try {
        const res = await fetch(
          `${URL}/api/message/getMessages?onSelectUser=${onSelectUser}`,
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
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          type: msg.image && msg.text ? "mixed" : msg.image ? "image" : "text",
          tempId: msg.tempId || "",
          fromUser:msg.fromUser,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      }
    };

    getMessage();
  }, [onSelectUser]);

  //xoa tin nhan
  const handleDeleteMessage = async (tempId) => {
    socket?.emit("deleteMessage", {
      receiveUser: onSelectUser,
      tempId: tempId,
    });

    setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatbox-container">
      <SideBarChat
        users={allUser}
        setOnSelectUser={setOnSelectUser}
        onSelectUser={onSelectUser}
        listUserOnline={listUserOnline}
      />
      <div className="chatbox">
        <div className="chatbox-header">
          <span>Hỗ trợ trực tuyến</span>
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
              {(msg.type === "image" || msg.type === "mixed") && msg.image && (
                <img
                  src={msg.image}
                  alt="message-img"
                  className="chatbox-image"
                />
              )}
              {msg.fromUser === false && msg.tempId && (
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
    </div>
  );
}
