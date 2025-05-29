import React, { useContext, useState } from "react";
import Slider from "react-slick";
import "./typicalDish.css";
import { StoreContext } from "../../context/StoreContext";

export default function TypicalDish() {
  const { food_list, URL } = useContext(StoreContext);
  const recommendFood = food_list.filter((food) => food.isRecommended);

  const settings = {
    dots: true,
    centerMode: true,
    centerPadding: "0px",
    infinite: recommendFood.length > 1,
    speed: 500,
    slidesToShow: Math.min(3, recommendFood.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, recommendFood.length),
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, recommendFood.length),
          centerMode: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="typical_dish">
      <Slider {...settings} className="dish_slider">
        {recommendFood && recommendFood.length > 0 ? (
          recommendFood.map((food) => (
            <div key={food._id}>
              <div className="dish_card">
                <img
                  src={`${URL}/${food.image}`}
                  alt={food.name}
                  className="dish_image"
                />
                <h3 className="dish_name">{food.name}</h3>
                <p className="dish_price">
                  {food.price.toLocaleString()} VND
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có món ăn để hiển thị.</p>
        )}
      </Slider>
    </div>
  );
}
