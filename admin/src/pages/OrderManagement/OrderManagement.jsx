import React, { useContext, useState } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import Management_Order from "../../components/Management_Order/Management_Order";
import SearchOrder from "../../components/Search/SearchOrder";

const OrderManagement = () => {
  const { allOrder } =
    useContext(StoreContext);
    const [searchReach, setSearchResult] = useState([])

  return (
    <div className="order-management-wrapper">
      <div className="order-management-search">
       <SearchOrder setSearchResult ={setSearchResult}/>
      </div>
      <div className="order-management-container">
        {searchReach.length > 0 ? (searchReach.map((item) => {
          return (
           <Management_Order item = {item} />
          );
        })):(
          allOrder.map((item) => {
            return (
             <Management_Order item = {item}/>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
