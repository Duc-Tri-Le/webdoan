import React, { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import { Link } from "react-router-dom";
import Management_Order from "../../components/Management_Order/Management_Order";

const ShippedManagement = () => {
  const { URL, allOrder, updateOrder, setState } = useContext(StoreContext);

  return (
    <div className="order-management-wrapper">
      <div className="order-management-container">
        {allOrder
          .filter((item) => item.state === "shipped")
          .map((item) => {
            return (
              <Management_Order item = {item}/>
            );
          })}
      </div>
    </div>
  );
};

export default ShippedManagement;
