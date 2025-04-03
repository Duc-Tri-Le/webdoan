import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Bill.css"
const Bill = () => {
  const { state } = useLocation();
  const orderData = state || {};
  const { URL } = useContext(StoreContext);

  console.log(orderData);
  return (
    <div className="bill-container">
      <div className="bill-follow-order">
        <span></span>
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
          orderData.item.map((item, index) => (
            <div key={index} className="bill-item">
              <div className="bill-detail">
                <div className="bill-item-image">
                  <img
                    src={item.image ? `${URL}/${item.image}` : "/fallback.jpg"}
                    alt={item.name || "No name"}
                  />
                </div>
                <span>{item.name || "Không có tên"}</span>
                <span>{item.quantity || 0}</span>
                <span>{item.price || 0} VND</span>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào trong hóa đơn.</p>
        )}

        <div className="bill-under">
          <span>Tổng tiền: {orderData?.total_price || 0} VND</span>
          <span>Phí giao hàng: {orderData?.delivery_fee || 0} VND</span>
          <span>Mã giảm giá: {orderData?.discount_code || "Không có"}</span>
          <span>Phương thức thanh toán: {orderData?.payment_method}</span>
        </div>
      </div>
    </div>
  );
};

export default Bill;
