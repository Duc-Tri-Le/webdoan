import React from "react";
import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({category}) => {
  const {food_list} = useContext(StoreContext);
  
  return (
    <div className="food_display" id="food_display">
      <h2>Top dishes</h2>
      <div className="food_display_list">
        {food_list.map((item, index) => {
          // {console.log(category,item.category);}
          if(category ==="All" || category === item.category){
            return (
                <FoodItem
                key = {index}
                  id={item._id}
                  name={item.name}
                  image= {item.image}
                  price={item.price}
                  description={item.description}
                />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
