import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CancelReturnOrder from "../../components/CancelReturnOrder/CancelReturnOrder";
import OrderComplete from "../../components/OrderComplete/OrderComplete";

import "./Bill.css";
const Bill = () => {
  const { state } = useLocation();
  const orderData = state || {};

  return (
    <div className="bill-container">
      <div className="bill-header-order">
        <span>{orderData.tracking_id}</span>
        <span>{orderData.state}</span>
      </div>
      {orderData.state !== "cancelled" && orderData.state !== "returned" ? (
        <OrderComplete orderData={orderData}/>
      ) : (
        <CancelReturnOrder orderData={orderData}/>
      )}
    </div>
  );
};

export default Bill;
