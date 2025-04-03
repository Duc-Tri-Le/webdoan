import React, { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import Management_Order from "../../components/Management_Order/Management_Order";

const CancelManagement = () => {
  const { allOrder } = useContext(StoreContext);

  return (
    <div className="order-management-wrapper">
      <div className="order-management-container">
        {allOrder
          .filter((item) => item.state === "cancelled")
          .map((item) => {
            return <Management_Order item={item} />;
          })}
      </div>
    </div>
  );
};

export default CancelManagement;
