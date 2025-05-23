import React, { useContext, useEffect, useRef, useState } from "react";
import "./List.css";
import { assets } from "../../assets/assets";
import { RemoveItem } from "../Remove/Remove";
import { Link } from "react-router-dom";
import { StoreContext } from "../../StoreContext/StoreContext";
import SearchListItem from "../../components/Search/SearchListItem";

const List = () => {
  const URL = "http://localhost:4000";
  const { token, list } = useContext(StoreContext);
  const [searchResult, setSearchResult] = useState([]);

  return (
    <div className="list-container">
      <div className="list-search">
        <SearchListItem setSearchResult={setSearchResult}/>
      </div>
      <div className="list-wrapper">
        <table>
          <thead>
            <tr>
              <th>Items</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Remove</th>
              <th>Update</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {searchResult.length > 0 ? (
              searchResult.map((item, index) => {
                // console.log("Image path:", item.image, "Type:", typeof item.image);
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={`${URL}/${item.image}`}
                        alt=""
                        className="item-image"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>
                      <span
                        className="remove-btn"
                        onClick={() => RemoveItem(item._id, getList, token)}
                      >
                        <img src={assets.remove} alt="" />
                      </span>
                    </td>
                    <Link to={`/update/${item._id}`} state={{ food: item }}>
                      <span className="update-btn">...</span>
                    </Link>
                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
                  </tr>
                );
              })
            ) : (
              list.map((item, index) => {
                // console.log("Image path:", item.image, "Type:", typeof item.image);
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={`${URL}/${item.image}`}
                        alt=""
                        className="item-image"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>
                      <span
                        className="remove-btn"
                        onClick={() => RemoveItem(item._id, getList, token)}
                      >
                        <img src={assets.remove} alt="" />
                      </span>
                    </td>
                    <Link to={`/update/${item._id}`} state={{ food: item }}>
                      <span className="update-btn">...</span>
                    </Link>
                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
