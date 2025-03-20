import React, { useContext, useEffect, useState } from "react";
import "./DetailOrder.css";
import { StoreContext } from "../../StoreContext/StoreContext";
import { useParams } from "react-router-dom";

const DetailOrder = () => {
  const { URL } = useContext(StoreContext);
  const [orderInf, setOrderInf] = useState({});
  const { id: tracking_id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${URL}/api/order/detail-order/${tracking_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        setOrderInf(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrder();
  }, [tracking_id]);

  return (
    <div className="wrapper">
      <div className="detail-header">
        <div className="order-state-tracking">
          <div className="return">Return</div>
          <div className="order-tracking_id">
            {`Tracking_id:${orderInf.tracking_id}`}
          </div>
          <div className="order-sate">{orderInf.state}</div>
        </div>
        <div className="order-options"></div>
      </div>
      <div className="detail-mid">
        <div className="detail-address">
          <p>Delivery Address</p>
          <div className="address">
            {orderInf?.address ? (
              <div>
                <p>{orderInf.address.first_name}</p>
                <p>{orderInf.address.last_name}</p>
                <p>{orderInf.address.street}</p>
                <p>
                  {orderInf.address.city}, {orderInf.address.state}
                </p>
                <p>
                  {orderInf.address.zip_code}, {orderInf.address.country}
                </p>
                <p>{orderInf.address.phone}</p>
              </div>
            ) : (
              <p>Chưa có thông tin địa chỉ</p>
            )}
          </div>
        </div>
      </div>
      <div className="detail-order">
        {orderInf?.items?.map((item, index) => (
          <div className="item" key={index}>
            <div className="name">{item.foodId?.name || "No Name"}</div>
            <div className="quantity">{item.quantity || 0}</div>
          </div>
        ))}
      </div>
      <div className="detail-bill">
        <p>{`Total price ${orderInf.total_price}`}</p>
        <p>{`Delivery_fee ${orderInf.delivery_fee}`}</p>
        <p>{`Discount code ${orderInf.discount_code}`}</p>
        <p>{`Payment method ${orderInf.payment_method}`}</p>
      </div>
    </div>
  );
};

export default DetailOrder;
