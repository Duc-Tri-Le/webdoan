import React, { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import Management_Order from "../../components/Management_Order/Management_Order"

function ReturnManagement() {
  const { URL, allOrder } = useContext(StoreContext);

  const listStateOrder = allOrder.filter((item) => (item.state === "returned" || item.state === "return request"))
  return (
    <div className="order-management-wrapper">
      <div className="order-management-container">
        {listStateOrder.length > 0 ? (listStateOrder
          .map((item) => {
            return (
              <Management_Order item = {item}/>
            );
          })):<>Không có sản phẩm nào</>}
      </div>
    </div>
  )
}

export default ReturnManagement;
