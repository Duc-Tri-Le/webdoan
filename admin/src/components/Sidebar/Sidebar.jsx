import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { ConfigRoutes } from "../../Router/Router";

export default function Sidebar() {
  const currentPath = window.location.pathname; // Lấy đường dẫn hiện tại

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <a
          href={ConfigRoutes.add}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.add ? "active" : ""
          }`}
        >
          <img src={assets.add} alt="" />
          <p>Add Items</p>
        </a>
        <a
          href={ConfigRoutes.list}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.list ? "active" : ""
          }`}
        >
          <img src={assets.list_items} alt="" />
          <p>List Items</p>
        </a>
        <a
          href={ConfigRoutes.update}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.update ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Update</p>
        </a>
        <a
          href={ConfigRoutes.order_management}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.order_management ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Order Management</p>
        </a>
        <a
          href={ConfigRoutes.delivery_management}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.delivery_management ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Delivery Management</p>
        </a>
        <a
          href={ConfigRoutes.shipped_management}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.shipped_management ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Shipped Management</p>
        </a>
        <a
          href={ConfigRoutes.cancel_management}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.cancel_management ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Cancel Management</p>
        </a>
        <a
          href={ConfigRoutes.return_management}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.return_management ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Return Management</p>
        </a>
        <a
          href={ConfigRoutes.list_staff}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.list_staff ? "active" : ""
          }`}
        > <img src={assets.order} alt="" />
        <p>List Staff</p></a>
        <a
          href={ConfigRoutes.sales_statistics}
          className={`sidebar-option ${
            currentPath === ConfigRoutes.sales_statistics ? "active" : ""
          }`}
        >
          <img src={assets.order} alt="" />
          <p>Sales Statistics</p>
        </a>
      </div>
    </div>
  );
}
