import React, { useState } from "react";
import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, sortBy }) => {
  const { food_list } = useContext(StoreContext);
  const [currentPage, setCurrentPae] = useState(1);
  const itemPage = 8;
  let filterFood = food_list.filter(
    (item) => category === "All" || category === item.category
  );

  if (sortBy === "tăng dần") {
    filterFood.sort((a, b) => a.price - b.price);
  } else if (sortBy === "giảm dần") {
    filterFood.sort((a, b) => b.price - a.price);
  } else if (sortBy === "đánh giá cao") {
    filterFood.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "") {
    filterFood = [...food_list];
  }

  const getNumberPage = () => {
    const page = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        page.push(i);
      }
    } else {
      if (currentPage <= 4) {
        page.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage > totalPages - 4) {
        page.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        page.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return page;
  };

  const totalPages = Math.ceil(filterFood.length / itemPage);
  const startIndex = (currentPage - 1) * itemPage;
  const listItemPage = filterFood.slice(startIndex, itemPage + startIndex);

  const handelChangePage = (numberPage) => {
    setCurrentPae(numberPage);
  };

  return (
    <div className="food_display" id="food_display">
      <h2>Top dishes</h2>
      <div className="food_display_list">
        {listItemPage.map((item, index) => {
          return (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating}
              description={item.description}
            />
          );
        })}
      </div>
      <div className="number-page-food-display">
        <button
          className="arrow-btn"
          disabled={currentPage === 1}
          onClick={() => handelChangePage(currentPage - 1)}
        >
          &lt;
        </button>

        {getNumberPage().map((number, index) => (
          <button
            onClick={() => handelChangePage(number)}
            key={index}
            className={`page-btn ${number === currentPage ? "active" : ""} ${
              number === "..." ? "dots" : ""
            }`}
            disabled={number === "..."}
          >
            {number}
          </button>
        ))}

        <button
          className="arrow-btn"
          disabled={currentPage === totalPages}
          onClick={() => handelChangePage(currentPage + 1)}
        >
          &gt;
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default FoodDisplay;
