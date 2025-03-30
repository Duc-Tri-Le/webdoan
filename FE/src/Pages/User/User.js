import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./User.css";

const User = () => {
  const { URL, token, getUSerIf, dataUSer } = useContext(StoreContext);
  const [listOrder, setListOrder] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [stateOrder, setStateOrder] = useState("All");
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();

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
      setShowOrder(true);
    } catch (error) {
      console.log(error);
    }
  };

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    DOB: "",
    role: "user",
  });

  useEffect(() => {
    if (dataUSer) {
      setEditData({
        name: dataUSer.name || "",
        email: dataUSer.email || "",
        phone: dataUSer.phone || "",
        DOB: dataUSer.DOB || "",
        role: dataUSer.role || "user",
      });
    }
  }, [dataUSer]);

  const updateUSer = async () => {
    try {
      const update = await fetch(`${URL}/api/user/update`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      const user = await update.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUSerIf();
      getListOrder();
    }
  }, [token]);

  const changeStateShowOrder = () => {
    setStateOrder("All");
    setShowOrder(true);
  };

  const handelAccount = () => {
    setShowOrder(false);
    setShowUser(true);
  };

  const handleSave = () => {
    updateUSer();
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // console.log(editData);
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
        {/* <div className="notification" onClick={() => setShowOrder(false)}>Notification</div> */}
        <div className="profile" onClick={handelAccount}>
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
                    <div
                      className="overview-order-inf-food"
                      onClick={() =>
                        navigate(`/detail-food/${food.foodId._id}`)
                      }
                    >
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
                <div className="button-overview">
                  <button className="contact-seller">Contact Seller</button>
                </div>
                {order.state === "food processing" ? (
                  <div className="button-overview">
                    <button className="cancel-order">Cancel</button>
                  </div>
                ) : null}
                {order.state === "delivered" ? (
                  <div className="button-overview">
                    <button className="return-order">Return</button>
                  </div>
                ) : null}
                {order.state === "delivered" || order.state === "returned" || order.state === "cancelled"  ? (
                  <div className="button-overview">
                    <button className="buy-again">Buy Again</button>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div>NO ORDER</div>
          )}
        </div>
      ) : null}
      {showUser && !showOrder ? (
        <div className="account-info">
          <label>
            <strong>Họ tên:</strong>
          </label>
          <input name="name" value={editData.name} onChange={handleChange} />

          <label>
            <strong>Email:</strong>
          </label>
          <input
            name="email"
            value={editData.email}
            onChange={handleChange}
            disabled
          />

          <label>
            <strong>Số điện thoại:</strong>
          </label>
          <input
            name="phone"
            value={editData.phone}
            onChange={handleChange}
            placeholder="Chưa cập nhật"
          />

          <label>
            <strong>Ngày sinh:</strong>
          </label>
          <input
            name="DOB"
            type="date"
            value={editData.DOB}
            onChange={handleChange}
          />

          <label>
            <strong>Vai trò:</strong>
          </label>
          <input name="role" value={editData.role} disabled />

          <button onClick={handleSave}>Lưu thay đổi</button>
        </div>
      ) : null}
    </div>
  );
};

export default User;
