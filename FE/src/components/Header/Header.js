import React, { useContext, useRef, useState } from "react";
import "./Header.css";
import { assets } from "../../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Search from "../Search/search";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

function Header({ setShowLogin }) {
  const [menu, setMenu] = useState("home");
  const { cartItems, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const sumItems = () => {
    let sum = 0;
    for (const item in cartItems) {
      sum += 1;
    }
    return sum;
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const user = () => {
    navigate("/user", {state:{showUser:true}
    });
  };
  
  const order = () => {
    navigate("/user", {
      state:{showOrder:true}
    });
  };

  return (
    <div className="Header">
      <div className="Header-container">
        <a href="/">
          <img
            src={assets.logo}
            alt=""
            style={{ height: "100px" }}
            className="logo"
          />
        </a>
        {/* duong link */}
        <ul className="Header-menu">
          <a
            href="/"
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}
            id="li"
            smooth={true}
            duration={500}
          >
            home
          </a>
          <Link
            to="/#exploreMenu"
            onClick={() => setMenu("menu")}
            className={menu === "menu" ? "active" : ""}
            id="li"
          >
            menu
          </Link>
          <Link
            to="/#app_download"
            onClick={() => setMenu("mobile-app")}
            className={menu === "mobile-app" ? "active" : ""}
            id="li"
          >
            mobile-app
          </Link>
          <Link
            to="/#footer"
            onClick={() => setMenu("contact-us")}
            className={menu === "contact-us" ? "active" : ""}
            id="li"
          >
            contact-us
          </Link>
        </ul>
        <div className="Header-right">
          <div className="Header-search">
            <Search />
            <div className="icon-link">
              <a href="/cart">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ padding: "20px" }}
                  className="img"
                />
              </a>
              {sumItems() ? <p className="sum_items">{sumItems()}</p> : <></>}
            </div>
          </div>
          {!token ? (
            <button
              onClick={() => setShowLogin(true)}
              className="Header-button"
            >
              Login
            </button>
          ) : (
            <div className="header-provide">
              <img src={assets.profile} />
              <ul className="header-provide-dropdown">
                <li onClick={order}>
                  <img src="" />
                  <p>Order</p>
                </li>
                <hr />
                <li onClick={user}>
                  <img src="" />
                  <p>User</p>
                </li>
                <hr />
                <li onClick={logOut}>
                  <img src="" />
                  LogOut
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
