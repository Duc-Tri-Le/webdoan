import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import TypicalDish from "../../components/Typical_dish/typicalDish";
import ExploreMenu from "../../components/ExploreMenu/exploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import SortBy from "../../components/SortBY/SortBy";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const { getListCart } = useContext(StoreContext);

  useEffect(() => {
    getListCart();
  }, []);
  return (
    <div className="home_container">
      <TypicalDish />
      <ExploreMenu category={category} setCategory={setCategory} />
      <SortBy sortBy={sortBy} setSortBy={setSortBy}/>
      <FoodDisplay category={category} sortBy={sortBy} />
    </div>
  );
};

export default Home;
