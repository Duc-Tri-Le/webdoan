import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const ManagementOrder = ({  stateOrder, setStateOrder, showOrder, setShowOrder }) => {
  
  const navigate = useNavigate();
  const { URL, token } = useContext(StoreContext);
  const [listOrder, setListOrder] = useState([]);

  const filteredOrders =
    stateOrder === "All"
      ? listOrder
      : listOrder.filter((order) => order.state === stateOrder);

  const handleBuyAgain = (order) => {
    navigate("/place-oder", { state: { order } });
  };

  const getListOrder = async () => {
    try {
      const response = await fetch(`${URL}/api/order/list-order`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setListOrder(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getListOrder();
    }
  }, [token]);

  const handleBill = (order) =>{
    navigate("/bill",{state : order})
  }
  return (
    <div className="user-content-order">
      <div className="order-state">
        {["All", "food processing", "on delivery", "delivered", "cancelled", "returned"].map((state) => (
          <span
            key={state}
            className={stateOrder === state ? "active" : ""}
            onClick={() => setStateOrder(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </span>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
          <div key={index} className="overview-order">
            <span className="overview-order-state">{order.state}</span>
            <span className="overview-order-stacking_id">{order.tracking_id}</span>
            <div className="overview-order-inf" onClick={() => handleBill(order)}>
              {order?.item.map((food) => (
                <div
                  key={food.foodId._id}
                  className="overview-order-inf-food"
                >
                  <span className="overview-order-inf-food-name">{food.foodId.name}</span>
                  <span className="overview-order-inf-food-quantity">{food.quantity}</span>
                  <span className="overview-order-inf-food-price">
                    {food.foodId.price * food.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="overview-order-foot">{order.total_price}</div>
            <div className="button-overview">
              <button className="contact-seller">Contact Seller</button>
            </div>

            {order.state === "food processing" && (
              <div className="button-overview">
                <button className="cancel-order">Cancel</button>
              </div>
            )}

            {order.state === "on delivery" && (
              <div className="button-overview">
                <button className="return-order">Return</button>
              </div>
            )}

            {["shipped", "returned", "cancelled", "delivered"].includes(order.state) && (
              <div className="button-overview">
                <button className="buy-again" onClick={() => handleBuyAgain(order)}>
                  Buy Again
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>NO ORDER</div>
      )}
    </div>
  );
};

export default ManagementOrder;
