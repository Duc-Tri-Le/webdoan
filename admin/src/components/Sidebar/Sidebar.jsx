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
    { to: ConfigRoutes.add, imgSrc: assets.add, text: "Thêm sản phẩm" },
    {
      to: ConfigRoutes.list,
      imgSrc: assets.list_items,
      text: "Danh sách sản phẩm",
    },
    {
      to: ConfigRoutes.update,
      imgSrc: assets.order,
      text: "cập nhật sản phẩm",
    },
    {
      to: ConfigRoutes.order_management,
      imgSrc: assets.order,
      text: "Quản lý dơn đặt hàng",
    },
    {
      to: ConfigRoutes.waiting_management,
      imgSrc: assets.order,
      text: "Quản lý đơn chờ xác nhận",
    },
    {
      to: ConfigRoutes.process_management,
      imgSrc: assets.order,
      text: "Quản lý đơn chờ lấy hàng",
    },
    {
      to: ConfigRoutes.delivery_management,
      imgSrc: assets.order,
      text: "Quản lý đơn đang vận chuyển",
    },
    {
      to: ConfigRoutes.shipped_management,
      imgSrc: assets.order,
      text: "Quản lý đơn đã được giao",
    },
    {
      to: ConfigRoutes.return_management,
      imgSrc: assets.order,
      text: "Quản lý đơn hoàn tiền",
    },
    {
      to: ConfigRoutes.cancel_management,
      imgSrc: assets.order,
      text: "Quản lý đơn huỷ",
    },
    {
      to: ConfigRoutes.list_staff,
      imgSrc: assets.order,
      text: "Danh sách nhân viên",
    },
    {
      to: ConfigRoutes.sales_statistics,
      imgSrc: assets.order,
      text: "Báo cáo thống kê",
    },
    {
      to: ConfigRoutes.product_recommendation,
      imgSrc: assets.order,
      text: "Khuyến nghị sản phẩm",
    },
    {
      to: `${ConfigRoutes.chatBox}?isChatBox=true`,
      imgSrc: assets.order,
      text: "Chat khách",
    },
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
