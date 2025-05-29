import React from "react";
import './SideBarChat.css'

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const SideBarChat = ({ users, onSelectUser, setOnSelectUser, listUserOnline }) => {
  return (
    <div className="sidebar-chat">
      <div className="sidebar-chat-header">Đoạn chat</div>
      <div className="user-list">
        {users?.map((user) => (
          <div
            key={user._id}
            className={`user-item ${
              user._id === onSelectUser ? "selected" : ""
            }`}
            onClick={() => setOnSelectUser(user._id)}
            title={user.name}
          >
            <div className="user-avatar">{getInitials(user.name)}</div>
            <div className="user-name">{user.name}</div>
            {listUserOnline.includes(user._id) && <div className="user-status online" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarChat;
