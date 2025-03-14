import React, { useState } from "react";
import "./home.css";
import Typical_dish from "../../components/Typical_dish/typicalDish";
import ExploreMenu from "../../components/ExploreMenu/exploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const Home = () => {
  const [category, setCategory] = useState("All");
  
  return (
    <div className="home_container">
      <Typical_dish />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category}/>
    </div>
  );
};

export default Home;
