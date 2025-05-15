import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const URL = "http://localhost:4000";
  const [dataUSer, setDataUser] = useState({})

  const getListFood = async () => {
    try {
      const response = await axios.get(URL + `/api/food/list-food`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  };

  const getListCart = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${URL}/api/cart/list-cart`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      setCartItems(data.item);
      // console.log(data.item);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giỏ hàng:", error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await getListFood();
        const storedToken = localStorage.getItem("token");
        // console.log(storedToken);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (token) {
      getListCart();
    }
  }, [token]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.foodId._id === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.foodId._id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = food_list.find((food) => food._id === itemId) || { _id: itemId, price: 0 };
    return [...prev, { foodId: newItem, quantity: 1 }];
      }
    });

    if (token) {
      await fetch(`${URL}/api/cart/add-cart`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodId: itemId }),
      });
    }
  };

  const removeCart = async (itemId) => {
    if (!token) return;
    setCartItems(
      (prev) =>
        prev
          .map((item) =>
            item.foodId && item.foodId._id === itemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // Xóa item nếu số lượng = 0
    );

    try {
      // Gửi request xóa hoặc giảm số lượng
      const response = await fetch(`${URL}/api/cart/remove-cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Lỗi khi xóa sản phẩm:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    }
  };

  const getUSerIf = async () => {
    try {
      const response = await fetch(`${URL}/api/user/getUserIf`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json()
      setDataUser(data.data)
    } catch (error) {}
  };

  const getAllListVoucher = async () => {
    const response = await fetch(`${URL}/api/voucher/allListVoucher`,{
      method:"GET",
      headers:{
        Authorization:token,
        "Content-Type":"application/json",
      },
    });
    return await response.json()
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeCart,
    setToken,
    token,
    URL,
    getListCart,
    getUSerIf,
    dataUSer,
    getAllListVoucher,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
