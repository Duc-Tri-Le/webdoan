import React, { useContext, useEffect } from "react";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./search.css";
import { StoreContext } from "../../context/StoreContext.js";
import { useDebounce } from "../Hook/useDebounced.js";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Search() {
  const [searchFood, setSearchFood] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { URL } = useContext(StoreContext);
  const debounced = useDebounce(searchFood, 500);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(true);

  const inputRef = useRef();
  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResults([]);
      return;
    }

    const handleSearch = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${URL}/api/food/search-food?search=${debounced}&type=less`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const searchData = await response.json();

        if (searchData.success) {
          setSearchResults(searchData.data);
        } else {
          console.error("Lỗi từ API:", searchData.message);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debounced]);

  const handleClear = () => {
    setSearchFood("");
    setSearchResults([]);
    setShowResult(false)
    inputRef.current.focus();
  };


  const handelChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchFood(searchValue);
    }
  };
  // console.log(searchResults);
  // console.log(showResult);

  return (
    <div className="search-container">
      <div className="search-bar">
        <FontAwesomeIcon
          icon={faSearch}
          style={{ color: "gray", marginLeft: "8px", cursor: "pointer" }}
        />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchFood}
          onChange={handelChange}
          className="search-input"
          onFocus={() => setShowResult(true)}
          ref={inputRef}
          style={{
            flex: 1,
            padding: "8px",
            border: "none",
            outline: "none",
            color: "gray",
          }}
        />
        {loading ? (
          <FontAwesomeIcon className="loading" icon={faSpinner} />
        ) : (
          searchFood && (
            <FontAwesomeIcon
              icon={faTimes}
              style={{ color: "gray", cursor: "pointer", marginRight: "8px" }}
              onClick={handleClear}
            />
          )
        )}
        {/* Kết quả tìm kiếm */}
        {showResult && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((food, index) => (
              <div key={index} className="search-item">
                <img
                  src={`${URL}/${food.image}`}
                  alt={food.name}
                  className="search-item-img"
                />
                <span className="search-item-name">{food.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Search;
