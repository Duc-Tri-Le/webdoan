import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);
const StoreContextProvider = ({ children }) => {

  const [token, setToken] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const URL = "http://localhost:4000";

  useEffect(() => {
    const getListOrder = async () => {
      try {
        const orderData = await fetch(`${URL}/api/order/list-admin-order`, {
          method: "GET",
        });
        if (!orderData.ok) {
          throw new Error(`Error ${orderData.status}: ${orderData.statusText}`);
        }
        const listOrder = await orderData.json();
        setAllOrder(listOrder.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error.message);
        alert("Có lỗi xảy ra khi tải đơn hàng! Vui lòng thử lại.");
      }
    };
    getListOrder();
  }, []);

//   console.log((allOrder));
  const contextValue = {
    allOrder,
    setAllOrder,
    URL,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
