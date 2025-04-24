import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { ConfigRoutes } from "../../Router/Router";

const SidebarOption = ({ to, imgSrc, text, isActive }) => {
  return (
    <a href={to} className={`sidebar-option ${isActive ? "active" : ""}`}>
      <img src={imgSrc} alt="" />
      <p>{text}</p>
    </a>
  );
};

export default function Sidebar() {
  const currentPath = window.location.pathname;

  const sidebarLinks = [
    { to: ConfigRoutes.add, imgSrc: assets.add, text: "Add Items" },
    { to: ConfigRoutes.list, imgSrc: assets.list_items, text: "List Items" },
    { to: ConfigRoutes.update, imgSrc: assets.order, text: "Update" },
    { to: ConfigRoutes.order_management, imgSrc: assets.order, text: "Order Management" },
    { to: ConfigRoutes.delivery_management, imgSrc: assets.order, text: "Delivery Management" },
    { to: ConfigRoutes.shipped_management, imgSrc: assets.order, text: "Shipped Management" },
    { to: ConfigRoutes.cancel_management, imgSrc: assets.order, text: "Cancel Management" },
    { to: ConfigRoutes.return_management, imgSrc: assets.order, text: "Return Management" },
    { to: ConfigRoutes.list_staff, imgSrc: assets.order, text: "List Staff" },
    { to: ConfigRoutes.sales_statistics, imgSrc: assets.order, text: "Sales Statistics" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {sidebarLinks.map((link, index) => (
          <SidebarOption
            key={index}
            to={link.to}
            imgSrc={link.imgSrc}
            text={link.text}
            isActive={currentPath === link.to}
          />
        ))}
      </div>
    </div>
  );
}

