import React, { useContext, useEffect, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, image, name, price, description }) => {
  const { cartItems, setCartItems, addToCart, removeCart, URL } =
    useContext(StoreContext);

  const item_f = cartItems?.reduce((acc, prev) => {
    if (prev.foodId?._id) {
      acc[prev.foodId._id] = prev.quantity;
    }
    return acc;
  }, {});
  // console.log(item_f);
  // console.log(cartItems);
  // console.log(item_f);

  return (
    <div className="food_item">
      <div className="food_item_img_container">
        <a href={`/detail-food/${id}`}>
          <img
            className="food_item_image"
            src={`${URL}/${image}`}
            alt="Ảnh món ăn"
          />
        </a>
        <div className="food_item_counter">
          {/* count */}
          {!item_f[id] ? (
            <img
              src={assets.add}
              alt=""
              className="add"
              onClick={() => {
                addToCart(id);
              }}
            />
          ) : (
            <div className="add_remove_icon">
              <img
                src={assets.remove}
                alt=""
                onClick={() => {
                  removeCart(id);
                }}
              />
              <p>{item_f[id]}</p>
              <img
                src={assets.add}
                alt=""
                onClick={() => {
                  addToCart(id);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* infor */}
      <div className="food_item_info">
        <div className="food_item_name_rating">
          <p>{name}</p>
          <div className="food_item_name_rating_img">
            <img src={assets.rating_start} alt />
          </div>
        </div>
        <p className="foo_item_de">{description}</p>
        <p className="foo_item_price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
