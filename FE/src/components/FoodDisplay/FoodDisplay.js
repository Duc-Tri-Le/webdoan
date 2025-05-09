import React from "react";
import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({category, sortBy} ) => {
  const {food_list} = useContext(StoreContext);
  console.log(food_list);
  let filterFood = food_list.filter(item => category ==="All" || category === item.category)

  if (sortBy === "tăng dần") {
    filterFood.sort((a, b) => a.price - b.price); 
  } else if (sortBy === "giảm dần") {
    filterFood.sort((a, b) => b.price - a.price); 
  } else if (sortBy === "đánh giá cao") {
    filterFood.sort((a, b) => b.rating - a.rating);
  } else if(sortBy === ""){
    filterFood = [...food_list];
  }
  
  return (
    <div className="food_display" id="food_display">
      <h2>Top dishes</h2>
      <div className="food_display_list">
        {filterFood.map((item, index) => {         
            return (
                <FoodItem
                key = {index}
                  id={item._id}
                  name={item.name}
                  image= {item.image}
                  price={item.price}
                  rating ={item.rating}
                  description={item.description}
                />
            );

        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
