import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Management_Order.css";

const Management_Order = ({ item }) => {
  const { URL, updateOrder, setState, state } = useContext(StoreContext);
  const navigate = useNavigate();

  const handelChangeStateOrder = async (orderId, stateOrder) => {
    const success = await updateOrder(orderId, stateOrder);
    setState(stateOrder);
    if (success) {
      if (stateOrder === "on delivery") {
        navigate("/delivery_management");
      } else if (stateOrder === "cancelled") {
        navigate("/cancel_management");
      } else if (stateOrder === "shipped") {
        navigate("/shipped_management");
      }
    }
  };

  return (
    <div className="management-container">
      <div key={item._id} className="management-item">
        <div className="management-header">
          <span
            className={item.payment_status ? "payment-paid" : "payment-unpaid"}
          >
            {item.payment_status ? "Paid" : "Unpaid"}
          </span>
          <span className="order-state">{item.state}</span>
          <span className="order-tracking-id">{item.tracking_id}</span>
          <Link to={`/detail_order/${item.tracking_id}`}>
            <p className="detail">...</p>
          </Link>
        </div>
        <div className="list-item">
          {item.items.map((data) => (
            <div key={data.foodId._id} className="one-item">
              <div>
                <img
                  src={
                    data.foodId.image
                      ? `${URL}/${data.foodId.image}`
                      : "fallback.jpg"
                  }
                  alt={data.foodId.name}
                />
              </div>
              <span className="data-name">{data.foodId.name}</span>
              <span className="data-quantity">{data.quantity}</span>
              <span className="data-price">{data.foodId.price}</span>
            </div>
          ))}
        </div>
        <div className="order-management-under">
          {item.state === "food processing" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.order_create).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button
                  onClick={() =>
                    handelChangeStateOrder(item._id, "on delivery")
                  }
                >
                  Confirm
                </button>
                <button
                  onClick={() => handelChangeStateOrder(item._id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {item.state === "on delivery" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.order_on_delivery).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button
                  onClick={() => handelChangeStateOrder(item._id, "shipped")}
                >
                  Shipped
                </button>
                <button
                  onClick={() => handelChangeStateOrder(item._id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {item.state === "shipped" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.order_shipped).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button>Contact Shop</button>
              </div>
            </div>
          )}
          {item.state === "cancelled" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.order_cancel).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button>Contact Shop</button>
              </div>
            </div>
          )}
          {item.state === "returned" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.order_return).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button>Contact Shop</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Management_Order;
