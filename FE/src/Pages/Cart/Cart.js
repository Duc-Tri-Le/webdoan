import React, { useContext } from "react";
import "./cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";

const Cart = () => {
  const { URL, cartItems, removeCart, addToCart, getTotalCartAmount } =
    useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <table className="cart-items-title">
          <thead>
            <tr>
              <th>Items</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Add</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => {
              if (item.quantity > 0) {
                return (
                  <tr>
                    <td>
                      <img
                        src={
                          item.foodId?.image
                            ? `${URL}/${item.foodId.image}`
                            : "fallback.jpg"
                        }
                        alt={item.foodId?.name || "No image"}
                        className="item-image"
                      />
                    </td>
                    <td>{item.foodId.name}</td>
                    <td>{item.foodId.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.foodId.price * item.quantity}</td>
                    <td>
                      <span
                        className="add-btn"
                        onClick={() => addToCart(item.foodId._id)}
                      >
                        <img src={assets.add} alt="" />
                      </span>
                    </td>
                    <td>
                      <span
                        className="remove-btn"
                        onClick={() => removeCart(item.foodId._id)}
                      >
                        ❌
                      </span>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
      <div className="cart-bottom">
        <h3>Cart Totals</h3>
        {/* Cart total */}
        <div className="cart-total">
          <div className="cart-total-total">
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>20</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>{getTotalCartAmount() + 20}</p>
            </div>
            <hr />
          </div>
          <button onClick={() => navigate("/place-oder")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        {/* Code sale */}
        <div className="cart-promo-code">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promo-code-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
