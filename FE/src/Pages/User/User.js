import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./User.css";

const User = () => {
  const { URL, token } = useContext(StoreContext);
  const [listOrder, setListOrder] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [stateOrder, setStateOrder] = useState("All");
  const [stateInfUser, setStateInfUser] = useState(false);
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
      setShowOrder(true)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) getListOrder()
  }, [token]);

  const changeStateShowOrder = () => {
    getListOrder();
    setStateOrder("All");
    setShowOrder(true);
  };

  const filteredOrders =
    stateOrder === "All"
      ? listOrder
      : listOrder.filter((order) => order.state === stateOrder);

  // console.log(listOrder);
  // console.log(stateOrder);
  // console.log(filteredOrders);
  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="notification">Notification</div>
        <div className="profile" onClick={() => setShowOrder(false)}>
          <span>My account</span>
        </div>
        <div className="list-order" onClick={changeStateShowOrder}>
          Orders
        </div>
      </div>
      {showOrder ? (
        <div className="user-content-order">
          <div className="order-state">
            <span
              className={stateOrder === "All" ? "active" : ""}
              onClick={() => setStateOrder("All")}
            >
              All
            </span>
            <span
              className={stateOrder === "food processing" ? "active" : ""}
              onClick={() => setStateOrder("food processing")}
            >
              Food processing
            </span>
            <span
              className={stateOrder === "on delivery" ? "active" : ""}
              onClick={() => setStateOrder("on delivery")}
            >
              On delivery
            </span>
            <span
              className={stateOrder === "delivered" ? "active" : ""}
              onClick={() => setStateOrder("delivered")}
            >
              Delivered
            </span>
            <span
              className={stateOrder === "cancelled" ? "active" : ""}
              onClick={() => setStateOrder("cancelled")}
            >
              Canceled
            </span>
            <span
              className={stateOrder === "returned" ? "active" : ""}
              onClick={() => setStateOrder("returned")}
            >
              Returned
            </span>
          </div>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div key={index} className="overview-order">
                <span className="overview-order-state">{order.state}</span>
                <div className="overview-order-inf">
                  {order?.items.map((food) => (
                    <div className="overview-order-inf-food">
                      <span className="overview-order-inf-food-name">
                        {food.foodId.name}
                      </span>
                      <span className="overview-order-inf-food-price">
                        {food.foodId.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="overview-order-foot">{order.total_price}</div>
              </div>
            ))
          ) : (
            <div>NO ORDER</div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default User;
