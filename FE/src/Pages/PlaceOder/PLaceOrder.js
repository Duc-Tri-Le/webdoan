import React, { useContext, useState, useEffect } from "react";
import "./placeOder.css";
import { StoreContext } from "../../context/StoreContext";
import { useLocation, useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { URL, cartItems, token } = useContext(StoreContext);
  const location = useLocation();
  const orderBuyAgain = location.state?.order || [];
  const navigate = useNavigate();
  const discount_code = 20;
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [payment_method, setPayment_method] = useState("cod");

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone: "",
  });

  const cartData = location.state?.order ? orderBuyAgain.items : cartItems;
  // console.log(cartData);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    let orderData = {
      address: data,
      item: orderItems,
      total_price: totalPrice,
      delivery_fee: 20,
      discount_code: discount_code,
      payment_method,
    };

    try {
      const response = await fetch(`${URL}/api/order/add-order`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Đặt hàng thất bại");
      }

      alert("Đặt hàng thành công!");
      navigate("/");
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.log(`Lỗi: ${error.message}`);
    }
  };

  useEffect(() => {
    let timePrice = 0
    if (location.state) { 
      const updatedItems = orderBuyAgain.items
        .map((item) => {
          if (item.quantity > 0) {
            timePrice += item.foodId.price * item.quantity;
            return { ...item.foodId, quantity: item.quantity };
          }
          return null;
        })
        .filter((item) => item !== null); // Lọc các giá trị nul
      setOrderItems(updatedItems);
    } else {
      const updatedItems = (cartItems || [])
        .map((item) => {
          if (item.quantity > 0) {
            timePrice += item.foodId.price * item.quantity;
            return { ...item.foodId, quantity: item.quantity };
          }
          return null;
        })
        .filter((item) => item !== null); // Lọc các giá trị null

      setOrderItems(updatedItems);
    }
    timePrice = timePrice - (timePrice * discount_code)/100 + 20;
    setTotalPrice(timePrice)
  }, [location.state, cartItems]);

  console.log(cartItems);
  return (
    <form className="place-order" onSubmit={placeOrder}>
      {/* left */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="first_name"
            value={data.first_name}
            onChange={handleChange}
            type="text"
            placeholder="First name"
          />
          <input
            name="last_name"
            value={data.last_name}
            onChange={handleChange}
            type="text"
            placeholder="Last name"
          />
        </div>
        {/* <input name="" type='email' placeholder='Email address'/> */}
        <input
          name="street"
          value={data.street}
          onChange={handleChange}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            name="city"
            value={data.city}
            onChange={handleChange}
            type="text"
            placeholder="City"
          />
          <input
            name="state"
            value={data.state}
            onChange={handleChange}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            name="zip_code"
            value={data.zip_code}
            onChange={handleChange}
            type="text"
            placeholder="Zip code"
          />
          <input
            name="country"
            value={data.country}
            onChange={handleChange}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          name="phone"
          value={data.phone}
          onChange={handleChange}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* item */}
      <div className="cart-items">
        <table className="cart-items-title">
          <thead>
            <tr>
              <th>Items</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item, index) => {
              if (item.quantity > 0) {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={`${URL}/${item.foodId.image}`}
                        alt=""
                        className="item-image"
                      />
                    </td>
                    <td>{item.foodId.name}</td>
                    <td>{item.foodId.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.foodId.price * item.quantity}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
      {/* right */}
      <div className="place-order-right">
        <div className="cart-total">
          <div className="cart-total-total">
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{totalPrice -20}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>20</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>{totalPrice}</p>
            </div>
            <hr />
          </div>
          <div className="radio-group">
            <label className="custom-radio">
              <input
                type="radio"
                value="cod"
                checked={payment_method === "cod"}
                onChange={() => setPayment_method("cod")}
              />
              <span className="checkmark"></span>
              Thanh toán khi nhận hàng
            </label>

            <label className="custom-radio">
              <input
                type="radio"
                value="online"
                checked={payment_method === "online"}
                onChange={() => setPayment_method("online")}
              />
              <span className="checkmark"></span>
              Thanh toán online
            </label>

            <p>
              Bạn đã chọn:{" "}
              {payment_method === "cod"
                ? "Thanh toán khi nhận hàng"
                : "Thanh toán online"}
            </p>
          </div>
          <button>Submit</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
