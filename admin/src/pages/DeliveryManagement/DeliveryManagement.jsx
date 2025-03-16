import React, { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";

const DeliveryManagement = () => {
  const { URL, allOrder, updateOrder, setState } = useContext(StoreContext);
  console.log(allOrder);
  const navigate = useNavigate();

  const handelChangeStateOrder = async (orderId, stateOrder ) => {
    const success = await updateOrder(orderId, stateOrder);
    setState(stateOrder)
    if (success) {
      if (stateOrder === "shipped") navigate("/shipped_management");
      else if (stateOrder === "cancelled") navigate("/cancel_management");
    }
  };  
  

  return (
    <div className="order-management-wrapper">
      <div className="order-management-container">
        {allOrder
          .filter((item) => item.state === "on delivery")
          .map((item) => {
            return (
              <div key ={item._id} className="order-management-item">
                <span
                  className={
                    item.payment_status ? "payment-paid" : "payment-unpaid"
                  }
                >
                  {item.payment_status ? "Paid" : "Unpaid"}
                </span>
                <div className="list-item">
                  {item.items.map((data) => {
                    return (
                      <div key={data.foodId._id}>
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
                    <button
                      onClick={() =>
                        handelChangeStateOrder(
                          item._id,
                         "shipped",
                        )
                      }
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() =>
                        handelChangeStateOrder(
                          item._id,
                         "cancelled",
                        )
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DeliveryManagement;
