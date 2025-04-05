import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Bill.css"
const Bill = () => {
  const { state } = useLocation();
  const orderData = state || {};
  const { URL } = useContext(StoreContext);
  const navigate = useNavigate();
  // console.log(orderData);

  return (
    <div className="bill-container">
      <div className="bill-follow-order">
        <span>{orderData.tracking_id}</span>
        <span>{orderData.state}</span>
      </div>
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
      <div className="bill">
        {orderData?.item?.length > 0 ? (
          orderData.item.map((food, index) => (
            <div key={index} className="bill-food">
              <div className="bill-detail">
                <div className="bill-item-image">
                  <img
                    src={food.foodId.image ? `${URL}/${food.foodId.image}` : "/fallback.jpg"}
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
    </div>
  );
};

export default Bill;
