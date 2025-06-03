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
              <th>Sản phẩm</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Loại</th>
              <th>Xoá sản phẩm</th>
              <th>Cập nhật</th>
              <th>THời gian cập nhật</th>
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
                        onClick={() => RemoveItem(item._id, token)}
                      >
                        <img src={assets.remove} alt="" />
                      </span>
                    </td>
                    <Link to={`/update/${item._id}`} state={{ food: item }}>
                      <span className="update-btn">...</span>
                    </Link>
                    <td>{item.updated_at ? new Date(item.updated_at).toLocaleString() : new Date(item.created_at).toLocaleString()}</td>
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
                        onClick={() => RemoveItem(item._id , token)}
                      >
                        <img src={assets.remove} alt="" />
                      </span>
                    </td>
                    <Link to={`/update/${item._id}`} state={{ food: item }}>
                      <span className="update-btn">...</span>
                    </Link>
                    <td>{item.updated_at ? new Date(item.updated_at).toLocaleString() : new Date(item.created_at).toLocaleString()}</td>
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
