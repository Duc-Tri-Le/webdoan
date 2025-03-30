import React, { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import { Link } from "react-router-dom";

const CancelManagement = () => {
  const { URL, allOrder, updateOrder } = useContext(StoreContext);

  return (
    <div className="order-management-wrapper">
      <div className="order-management-container">
        {allOrder
          .filter((item) => item.state === "cancelled")
          .map((item) => {
            return (
              <div className="order-management-item">
                <span
                  className={
                    item.payment_status ? "payment-paid" : "payment-unpaid"
                  }
                >
                  {item.payment_status ? "Paid" : "Unpaid"}
                </span>
                <span className="order-state">{item.state}</span>
                <Link to={`/detail_order/${item.tracking_id}`}>
                  <p className="detail">....</p>
                </Link>
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
                    {/* <button
                    onClick={() =>
                      handelChangeStateOrder({ orderId: item._id })
                    }
                  >
                    Confirm
                  </button> */}
                    {/* <button>Cancel</button> */}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CancelManagement;
