import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./OrderComplete.css";

const OrderComplete = ({ orderData }) => {
  const navigate = useNavigate();
  const { URL } = useContext(StoreContext);

  const detailStateOrder = [
    {
      icon: "",
      text: "Đã đặt hàng",
      time: orderData?.order_create
        ? new Date(orderData.order_create).toLocaleDateString()
        : "",
    },
    {
      icon: "",
      text: "Đang vận chuyển",
      time: orderData?.order_on_delivery
        ? new Date(orderData.order_on_delivery).toLocaleDateString()
        : "",
    },
    {
      icon: "",
      text: "Đã giao hàng",
      time: orderData?.order_shipped
        ? new Date(orderData.order_shipped).toLocaleDateString()
        : "",
    },
    {
      icon: "",
      text: "Đã đánh giá",
      time: orderData?.order_reviewed
        ? new Date(orderData.order_reviewed).toLocaleDateString()
        : "",
    },
  ];
  console.log(orderData);
  console.log(orderData.address);
  return (
    <div>
      <section>
        <h2></h2>
        <div className="detail-state-order">
          {detailStateOrder.map((item, key) => (
            <div className="bill-order-state">
              <div className="bill-order-icon">{item.icon}</div>
              <div className="bill-order-text">{item.text}</div>
              {item.time && <div className="bill-order-time">{item.time}</div>}
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="bill-give-order">
          <p>Địa chỉ nhận hàng</p>
          <span>
            {orderData.address.first_name} {orderData.address.last_name}
          </span>
          <span>{orderData.address.phone}</span>
          <span>
            {orderData.address.street},{orderData.address.city},
            {orderData.address.country}
          </span>
        </div>
      </section>
      <section>
        <div className="bill">
          {orderData?.item?.length > 0 ? (
            orderData.item.map((food, index) => (
              <div key={index} className="bill-food">
                <div className="bill-detail">
                  <div className="bill-item-image">
                    <img
                      src={
                        food.foodId.image
                          ? `${URL}/${food.foodId.image}`
                          : "/fallback.jpg"
                      }
                      alt={food.foodId.name || "No name"}
                      onClick={() => navigate(`/detail-food/${food.foodId._id}`)}
                    />
                  </div>
                  <span>{food.foodId.name || "Không có tên"}</span>
                  <span>{food.quantity || 0}</span>
                  <span>{food.foodId.price * food.quantity || 0} VND</span>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào trong hóa đơn.</p>
          )}
          <div className="bill-under">
            <span>Tổng tiền: {orderData?.total_price || 0} VND</span>
            <span>Phí giao hàng: {orderData?.delivery_fee || 0} VND</span>
            <span>Mã giảm giá: {orderData?.discount_code || "Không có"}%</span>
            <span>Phương thức thanh toán: {orderData?.payment_method}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderComplete;
