import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./search.css";

function Search() {
  const [query, setQuery] = useState("");

  return (
    <div className="search-bar">
      <FontAwesomeIcon icon={faSearch} style={{ color: "gray", marginLeft: "8px", cursor:"pointer"
    }} />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        style={{ flex: 1, padding: "8px", border: "none", outline: "none", color: "gray" }}
      />
      {query && (
         <FontAwesomeIcon
          icon={faTimes}
          style={{ color: "gray", cursor: "pointer", marginRight: "8px" }}
          onClick={() => setQuery("")}
        />
      )}
    </div>
  );
}
export default Search;
