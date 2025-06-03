import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);
const StoreContextProvider = ({ children }) => {
  const [state, setState] = useState('');
  const [allOrder, setAllOrder] = useState([]);
  const URL = "http://localhost:4000";
  const [list, setList] = useState([]);
  const [token, setToken] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const getListOrder = async () => {
      try {
        const orderData = await fetch(`${URL}/api/order/list-admin-order`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!orderData.ok) {
          throw new Error(`Error ${orderData.status}: ${orderData.statusText}`);
        }
        const listOrder = await orderData.json();
        const listOrderSort = listOrder.data.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        setAllOrder(listOrderSort);
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

  const getList = async () => {
    try {
      const response = await axios.get(`${URL}/api/food/list-food`);
      // console.log(response);
      if (response.data.success) {
        setList(response.data.data);
        console.log("da lay");
      }
    } catch (error) {
      console.log({error});
    }
  };

  useEffect(()=>{
    const loadData = async () => {
      try {
        await getList();
        const storedToken = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
        if (storedToken) {
          setToken(storedToken);
          setUserId(userId)
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData()
  },[])

  const updateRecommendation = async (product) =>{
    const response = await fetch(`${URL}/api/food/recommendation`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body:JSON.stringify({product})
    })
  }

  const getAllUser = async (token) => {
    try {
      const responsive = await fetch(`${URL}/api/user/listUser`,{
        method:"GET",
        headers:{
          Authorization:token,
          "Content-Type":"application/json",
        },
      })
      const listUser = await responsive.json();
      return listUser.data
    } catch (error) {
      console.log(error);
    }
}

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
    token,
    setToken,
    list,
    updateRecommendation,
    userId,
    setUserId,
    getAllUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
