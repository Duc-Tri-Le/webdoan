import React from "react";
import { menu_list } from "../../assets/assets";
import "./exploreMenu.css";
const exploreMenu = ({ category, setCategory }) => {
  return (
    <div className="exploreMenu" id="exploreMenu">
      <h1>Explore Menu</h1>
      <p className="explore_menu_text">
        choose from a menu
        <div className="explore_menu_list">
          {menu_list.map((item, index) => {
            return (
              <div
                onClick={() =>
                  setCategory((prev) =>
                    prev === item.name ? "All" : item.name
                  )
                }
                key={index}
                className="explore_menu_list_item"
              >
                <img src={item.image} alt={item.name} className= {category == item.name ? "active" : ""} />
                <p className="item_name">{item.name}</p>
              </div>
            );
          })}
        </div>
      </p>
      <hr />
    </div>
  );
};

export default exploreMenu;
