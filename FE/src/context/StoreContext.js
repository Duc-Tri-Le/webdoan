import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const URL = "http://localhost:4000";

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
      console.log(data.item);
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
      return prev.map((item) => {
        return item.foodId._id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      });
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

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item of cartItems) {
      // ✅ item là object thực sự
      if (item.quantity > 0) {
        totalAmount += item.foodId.price * item.quantity;
      }
    }
    return totalAmount;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeCart,
    getTotalCartAmount,
    setToken,
    token,
    URL,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
