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
      } else if (stateOrder === "food processing") {
        navigate("/process_management");
      } else if (stateOrder === "returned") {
        navigate("/return_management");
      } 
    }
  };

  const confirmReturn = async (orderId, stateOrder) => {
    try {
      const res = await fetch(`${URL}/api/order/return-order`,{
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, stateOrder }),
      })
      window.location.reload()
      return res
    } catch (error) {
      console.log(error);
    }
  }


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
          {item.item.map((data) => (
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
          {/* dang cho xac nhan */}
          {item.state === "waiting for" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button
                  onClick={() =>
                    handelChangeStateOrder(item._id, "food processing")
                  }
                >
                  Chấp thuận đơn
                </button>
              </div>
            </div>
          )}
          {/* cho van chuyen */}
          {item.state === "food processing" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button
                  onClick={() =>
                    handelChangeStateOrder(item._id, "on delivery")
                  }
                >
                  Xác nhận đơn
                </button>
              </div>
            </div>
          )}
          {/* dang giao */}
          {item.state === "on delivery" && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button
                  onClick={() => handelChangeStateOrder(item._id, "shipped")}
                >
                  Đã giao
                </button>
              </div>
            </div>
          )}
          {/* da hoan thanh, huy */}
          {(item.state === "cancelled" || item.state === "shipped") && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
            </div>
          )}
          {/* hoan tien */}
          {(item.state === "return request") && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
              <div className="confirm-remove-order">
                <button
                  onClick={() => confirmReturn(item._id, "returned")}
                >
                  Chấp nhận hoàn tiền
                </button>
                <button
                  onClick={() => confirmReturn(item._id, "shipped")}
                >
                  Từ chối hoàn tiền
                </button>
              </div>
            </div>
          )}
          {(item.state === "returned" ) && (
            <div className="order-management-under-all">
              <div className="order-management-price-time">
                <span>{new Date(item.updatedAt).toLocaleString()}</span>
                <span>{item.total_price}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Management_Order;
