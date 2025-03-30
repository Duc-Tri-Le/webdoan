import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { assets } from "../../assets/assets.js";
import { useDebounce } from "../Hook/useDebounce.jsx";
import { StoreContext } from "../../StoreContext/StoreContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({showLogin, setShowLogin}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { URL } = useContext(StoreContext);
  const debounced = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResults([]);
      return;
    }

    const handleSearch = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${URL}/api/order/search-order?search=${debounced}&type=less`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Lỗi khi gọi API");
        const searchData = await response.json();

        if (searchData.success) {
          setSearchResults(searchData.data);
        } else {
          console.error("Lỗi từ API:", searchData.message);
          setSearchResults([]);
        }
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debounced]);

  // console.log(searchResults);
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith(" ")) {
      setSearchValue(value);
      setShowResults(true);
    }
  };

  const handleUserB = () => {};
  const logOut = () => {
    setShowLogin(true)
  };
  const handleClear = () => {
    setSearchValue("");
    setShowResults(false);
  };

  // console.log(debounced);
  return (
    <div className="header-wrapper">
      <div className="header-logo">
        <img className="logo" alt="" src={assets.logo} />
      </div>
      <div className="header-search">
        <FontAwesomeIcon
          icon={faSearch}
          style={{ color: "gray", marginLeft: "8px", cursor: "pointer" }}
        />
        <input
          className="input-search"
          type="text"
          placeholder="tìm theo mã vận đơn hoặc sđt người đặt"
          value={searchValue}
          onChange={handleChange}
          onFocus={() => setShowResults(true)}
        ></input>
        {loading ? (
          <FontAwesomeIcon className="loading" icon={faSpinner} />
        ) : (
          searchValue && (
            <FontAwesomeIcon
              icon={faTimes}
              style={{ color: "gray", cursor: "pointer", marginRight: "8px" }}
              onClick={handleClear}
            />
          )
        )}
        {/* Kết quả tìm kiếm */}
        {showResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((order, index) => (
              <div key={index}>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-items-item">
                      <div className="order-items-item-image">
                        <img src={`${URL}/${item.foodId.image}`} />
                      </div>
                      <div className="order-items-item-name">
                        {item.foodId.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
