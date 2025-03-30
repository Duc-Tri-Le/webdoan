import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import Typical_dish from "../../components/Typical_dish/typicalDish";
import ExploreMenu from "../../components/ExploreMenu/exploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const [category, setCategory] = useState("All");
  const {getListCart} = useContext(StoreContext)

  useEffect(() => {
    getListCart()
  },[])
  return (
    <div className="home_container">
      <Typical_dish />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category}/>
    </div>
  );
};

export default Home;
