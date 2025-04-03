import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "../Hook/useDebounce";
import { StoreContext } from "../../StoreContext/StoreContext";

const SearchOrder = ({setSearchResult}) => {
  const { URL } = useContext(StoreContext);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounced = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResult([]);
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
          setSearchResult(searchData.data);
        } else {
          console.error("Lỗi từ API:", searchData.message);
          setSearchResult([]);
        }
      } catch (error) {
        console.log(error);
        setSearchResult([]);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [debounced, URL]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith(" ")) {
      setSearchValue(value);
      setShowResults(true);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setShowResults(false);
  };

  return (
    <div className="management-search">
      <FontAwesomeIcon
        icon={faSearch}
        style={{ color: "gray", marginLeft: "8px", cursor: "pointer" }}
      />
      <input
        className="input-search"
        type="text"
        placeholder="Tìm theo mã vận đơn hoặc sđt người đặt"
        value={searchValue}
        onChange={handleChange}
        onFocus={() => setShowResults(true)}
      />
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
    </div>
  );
};

export default SearchOrder;
