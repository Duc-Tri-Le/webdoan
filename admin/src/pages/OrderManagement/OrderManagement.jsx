import React, { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import "./OrderManagement.css";

const OrderManagement = () => {
  const { URL, allOrder, setAllOrder } = useContext(StoreContext);
  console.log(allOrder);
  return (
    <div className="order-management-wrapper">
      <div className="order-management-container">
        {allOrder.map((item) => {
          return (
            <div className="order-management-item">
              <span className="payment-status">
                {item.payment_status ? "Paid" : "Unpaid"}
              </span>
              <div className="list-item">
                {item.items.map((data) => {
                  return (
                    <div>
                      <div>
                        <img
                          src={
                            data.foodId.image
                              ? `${URL}/${data.foodId.image}`
                              : "fallback.jpg"
                          }
                        />
                      </div>
                      <span className="data-name">{data.foodId.name}</span>
                      <span className="data-quantity">{data.quantity}</span>
                      <span className="data-price">{data.foodId.price}</span>
                    </div>
                  );
                })}
              </div>
              <div className="order-management-under">
                <span>{item.total_price}</span>
                <div className="confirm-remove-order">
                  <button>Confirm</button>
                  <button>Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderManagement;
