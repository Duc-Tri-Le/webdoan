import React, { useContext, useEffect, useRef, useState } from "react";
import "./DetailFood.css";
import { StoreContext } from "../../context/StoreContext";
import { useParams } from "react-router-dom";
import FilterStar from "../../components/FilterStar/FilterStar";

const DetailFood = () => {
  const { URL, token, addToCart, removeCart } = useContext(StoreContext);
  const { id: food_id } = useParams();
  const [infFood, setInfFood] = useState({});
  const inputRef = useRef(null);
  const [valueReview, setValueReview] = useState("");
  const [valueRating, setValueRating] = useState(0);
  const [startRating, setStartRating] = useState("");

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

  const addReviewFood = async () => {
    try {
      const response = await fetch(`${URL}/api/food/add-review/${food_id}`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review: valueReview, rating_food: valueRating }),
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

  const reviewChange = (e) => {
    setValueReview(e.target.value);
  };
  
  let filterReviewFood = infFood?.reviews?.filter((review) => startRating === "" || review.rating_review === parseInt(startRating))
  console.log(filterReviewFood);
  console.log(infFood);
  console.log(startRating);
 
  return (
    <div className="wrapper-food" ref={inputRef}>
      <div className="wrapper-food-head">
        <div className="wrapper-food-head-img">
          <img src={`${URL}/${infFood.image}`} />
        </div>
        <span className="food-name">{infFood.name}</span>
        <span className="food-price">{infFood.price}</span>
        <div class="button-group">
          <button class="add-art" onClick={() => addToCart(infFood._id)}>
            Add cart
          </button>
          <button class="buy">Buy</button>
        </div>
      </div>

      <div className="inf-food">
        <span>{`Category : ${infFood.category}`}</span>
        <span>{`Description : ${infFood.description}`}</span>
      </div>

      {/* tổng quan về đánh giá */}
      <div className="overview-review-food">
        <p>Đánh giá sản phẩm {infFood.name}</p>
        <div className="left-review-food">
          <p>{infFood.rating}/5</p>
          <div className="review-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  color: infFood.rating >= star ? "#facc15" : "#e5e7eb",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="right-review-food">
          {[1, 2, 3, 4, 5].map((star) => (
            <div className="start-detail">
              <span>{star}</span>
              <span key={star} style={{ color: "#facc15" }}>
                ★
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* lọc đánh giá */}
      <FilterStar startRating={startRating} setStartRating={setStartRating}/>

      {/* component đánh giá */}
      <div className="review-food">
        {filterReviewFood?.map((data, index) => (
          <div key={index}>
            <span className="review-food-name">
              {data?.user_id?.name || "AmongUs"}
            </span>
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: data.rating_review >= star ? "#facc15" : "#e5e7eb",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="review-food-text">{data?.text || ""}</div>
          </div>
        ))}
      </div>

      {/* thêm đánh giá */}
      <div className="review-food">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setValueRating(star)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                color: valueRating >= star ? "#facc15" : "#e5e7eb",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div className="input-text">
          <input
            type="text"
            name="review"
            value={valueReview}
            onChange={reviewChange}
          ></input>
          <button className="add-review" onClick={addReviewFood}>
            Viết đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailFood;
