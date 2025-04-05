import React, { useContext, useEffect, useRef, useState } from "react";
import "./DetailFood.css";
import { StoreContext } from "../../context/StoreContext";
import { useParams } from "react-router-dom";

const DetailFood = () => {
  const { URL, token,addToCart,removeCart } = useContext(StoreContext);
  const { id: food_id } = useParams();
  const [infFood, setInfFood] = useState({});
  const inputRef = useRef(null); // Tạo ref
  const [valueReview, setValueReview] = useState("");

  useEffect(() => {
    const getDetailFood = async () => {
      try {
        const fetchAPI = await fetch(`${URL}/api/food/detail-food/${food_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await fetchAPI.json();
        setInfFood(data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getDetailFood();
  }, [food_id]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [infFood]);

  const addReviewFood = async () => {
    try {
      const response = await fetch(`${URL}/api/food/add-review/${food_id}`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review: valueReview }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setInfFood(data.data);
      console.log("Phản hồi từ server:", data);
      setValueReview("");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };
console.log(infFood);
  const reviewChange = (e) => {
    setValueReview(e.target.value);
  };
  return (
    <div className="wrapper-food" ref={inputRef}>
      <div className="wrapper-food-head">
        <div className="wrapper-food-head-img">
          <img src={`${URL}/${infFood.image}`} />
        </div>
        <span className="food-name">{infFood.name}</span>
        <span className="food-price">{infFood.price}</span>
        <div class="button-group">
          <button class="add-art" onClick={() => addToCart(infFood._id)}>Add cart</button>
          <button class="buy">Buy</button>
        </div>
      </div>

      <div className="inf-food">
        <span>{`Category : ${infFood.category}`}</span>
        <span>{`Description : ${infFood.description}`}</span>
      </div>

      <div className="review-food">
        {infFood?.reviews?.map((data, index) => (
          <div key={index}>
            <span className="review-food-name">{data?.user_id?.name || "AmongUs"}</span>
            <div className="review-food-text">{data?.text || ""}</div>
          </div>
        ))}
        <div className="input-review">
          <input
            type="text"
            name="review"
            value={valueReview}
            onChange={reviewChange}
          ></input>
          <button className="add-review" onClick={addReviewFood}>
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailFood;
