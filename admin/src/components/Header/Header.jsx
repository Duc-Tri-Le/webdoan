import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../StoreContext/StoreContext.jsx";


const Header = ({showLogin, setShowLogin}) => {
  const { URL } = useContext(StoreContext);

  const handleUserB = () => {};
  const logOut = () => {
    setShowLogin(true)
    localStorage.removeItem("token");
    setToken("");
  };

  // console.log(debounced);
  return (
    <div className="header-wrapper">
      <div className="header-logo">
        <img className="logo" alt="" src={assets.logo} />
      </div>
      {showLogin ? (
        <button onClick={() => setShowLogin(true)} className="Header-button">
          Login
        </button>
      ) : (
        <div className="header-provide">
          <img src={assets.profile}/>
          <ul className="header-provide-dropdown">
            <li onClick={handleUserB}>User_B</li>
            <li onClick={logOut}>LogOut</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
