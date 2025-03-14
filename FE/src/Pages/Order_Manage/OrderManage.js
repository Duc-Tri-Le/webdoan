import React, { useState, useEffect, useContext } from "react";
import "./OrderManage.css";
import { StoreContext } from "../../context/StoreContext";

const OrderManage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { URL, token } = useContext(StoreContext);

  const [allOrder, setAllOrder] = useState([]);

  useEffect(() => {
    const getListOrder = async (req, res) => {
      try {
        const resOrder = await fetch(`${URL}/api/order/list-order`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
        setAllOrder(resOrder.json());
      } catch (error) {
        console.log(error);
      }
    };
    getListOrder();
  }, []);

  const getOrder = activeTab === "All" ? allOrder : allOrder.filter((item) => item.status === activeTab);

  const tabs = [
    "All",
    "food processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
    "returned",
  ];

  return (
    <div className="order-container">
      {/* Thanh tìm kiếm */}
      <div className="order-search">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên Shop, ID đơn hàng hoặc tên sản phẩm..."
          className="search-input"
        />
      </div>
      {/* Tabs Điều Hướng */}
      <div className="order-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`order-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        {}
      </div>
      <div className="order-list">
        {getOrder.length > 0 ? (
          getOrder.map((order) => (
            <div key={order.id} className="order-item">
              <p>ID Đơn hàng: {order.id}</p>
              <p>Trạng thái: {order.status}</p>
              <p>Sản phẩm: {order.productName}</p>
            </div>
          ))
        ) : (
          <p>Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default OrderManage;
