import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./CancelReturnOrder.css";

const CancelReturnOrder = ({ orderData }) => {
  const { URL } = useContext(StoreContext);
  const navigate = useNavigate();
  const detailState = [
    { text: "Gửi yêu cầu" },
    { text: "Được chấp thuận" },
    { text: "Đã hoàn tiền" },
  ];
  return (
    <div>
      <section>
        <h2></h2>
        <div className="detail-state-order">
          {detailState.map((item) => (
            <div className="bill-order-text">{item.text} </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Đã hoàn tiền</h2>
      </section>
      <section>
        <h2></h2>
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
          <span>Số tiền hoàn: {orderData?.total_price || 0} VND</span>
          <span>Hoàn tiền vào: {orderData?.payment_method}</span>
        </div>
      </section>
    </div>
  );
};

export default CancelReturnOrder;
