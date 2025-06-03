import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ManagementOrder.css";

const ManagementOrder = ({ stateOrder, setStateOrder }) => {
  const navigate = useNavigate();
  const { URL, token } = useContext(StoreContext);
  const [listOrder, setListOrder] = useState([]);

  const filteredOrders =
    stateOrder === "All"
      ? listOrder
      : Array.isArray(stateOrder)
      ? listOrder.filter((order) => stateOrder.includes(order.state))
      : listOrder.filter((order) => order.state === stateOrder);

  const handleBuyAgain = (order) => {
    navigate("/place-oder", { state: { order } });
  };

  const updateOrder = async (orderId, state) => {
    try {
      const res = await fetch(`${URL}/api/order/update-order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, state: state }),
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmReturn = async (orderId, stateOrder) => {
    try {
      const res = await fetch(`${URL}/api/order/return-order`,{
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, stateOrder }),
      })
      return res
    } catch (error) {
      console.log(error);
    }
  }

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

  const handleBill = (order) => {
    navigate("/bill", { state: order });
  };

  return (
    <div className="user-content-order">
      <div className="order-state">
        {[
          { label: "Tất cả", value: "All" },
          { label: "Chờ xác nhận", value: "waiting for" },
          { label: "Đang chuẩn bị", value: "food processing" },
          { label: "Đang giao hàng", value: "on delivery" },
          { label: "Đã giao", value: "shipped" },
          { label: "Đã hủy", value: "cancelled" },
          { label: "Đã hoàn trả", value: ["returned", "return request"] },
        ].map((state) => (
          <span
            key={state.value}
            className={stateOrder === state.value ? "active" : ""}
            onClick={() => setStateOrder(state.value)}
          >
            {state.label}
          </span>
        ))}
      </div>

      {filteredOrders?.length > 0 ? (
        filteredOrders?.map((order, index) => (
          <div key={index} className="overview-order">
            <span className="overview-order-state">{order.state}</span>
            <span className="overview-order-stacking_id">
              {order.tracking_id}
            </span>
            <div
              className="overview-order-inf"
              onClick={() => handleBill(order)}
            >
              {order?.item.map((food) => (
                <div key={food.foodId._id} className="overview-order-inf-food">
                  <span className="overview-order-inf-food-image">
                    <img src={`${URL}/${food.foodId.image}`} />
                  </span>
                  <span className="overview-order-inf-food-name">
                    {food.foodId.name}
                  </span>
                  <span className="overview-order-inf-food-quantity">
                    {food.quantity}
                  </span>
                  <span className="overview-order-inf-food-price">
                    {food.foodId.price * food.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="overview-order-foot">{order.total_price}</div>
            <div className="overview-order-time">
              {new Date(order.updatedAt).toLocaleString()}
            </div>
            {/* <div className="button-overview">
              <button className="contact-seller">Contact Seller</button>
            </div> */}

            <div className="button-all">
              {order.state === "waiting for" && (
                <div className="button-overview">
                  <button
                    className="cancel-order"
                    onClick={() => confirmReturn(order._id, "cancel")}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {order.state === "shipped" && (
                <div className="button-overview">
                  <button
                    className="return-order"
                    onClick={() => updateOrder(order._id, "return request")}
                  >
                    Return
                  </button>
                </div>
              )}
              {["shipped", "returned", "cancelled"].includes(order.state) && (
                <div className="button-overview">
                  <button
                    className="buy-again"
                    onClick={() => handleBuyAgain(order)}
                  >
                    Buy Again
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>NO ORDER</div>
      )}
    </div>
  );
};

export default ManagementOrder;
