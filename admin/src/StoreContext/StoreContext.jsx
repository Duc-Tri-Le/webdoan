import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);
const StoreContextProvider = ({ children }) => {
  const [state, setState] = useState('');
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
  }, [state]);

  const updateOrder = async (orderId, stateOrder) => {
    try {
      const response = await fetch(`${URL}/api/order/update-order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, state: stateOrder }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update order: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Order updated successfully:", result);

      return true; // Trả về dữ liệu nếu cần cập nhật UI
    } catch (error) {
      console.error("Error confirming order:", error);
      return null; // Tránh lỗi nếu gọi function mà không có dữ liệu trả về
    }
  };

  // const cancelOrder = async (orderId) => {
  //   try {
  //     const cancel = await fetch(`${URL}/api/order/remove-order/${orderId}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     });
  //     const result = await cancel.json();
  //     console.log(("Order cancel successfully: ", result));
  //     return result.success
  //   } catch (error) {
  //     console.log("Error cancel order: ", error);
  //     return null;
  //   }
  // };

  //   console.log((allOrder));
  const contextValue = {
    allOrder,
    setAllOrder,
    URL,
    updateOrder,
    state,
    setState,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
