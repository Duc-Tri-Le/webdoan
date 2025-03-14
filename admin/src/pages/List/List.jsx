import React, { useEffect, useRef, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { RemoveItem } from "../Remove/Remove";
import { Link } from "react-router-dom";

const List = () => {
  const API_URL = "http://localhost:4000/api/food/";
  const URL = "http://localhost:4000";
  const [list, setList] = useState([]);
  const [check, setCheck] = useState(false);
  const getList = async () => {
    try {
      const response = await axios.get(`${API_URL}list-food`);
      // console.log(response);
      if (response.data.success) {
        setList(response.data.data);
        toast.success("da lay");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // console.log(list);
  useEffect(() => {
    getList();
  }, []);

  return (
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
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => {
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
                    onClick={() => RemoveItem(item._id, getList)}
                  >
                    <img src={assets.remove} alt="" />
                  </span>
                </td>
                <Link to={`/update/${item._id}`} state={{ food: item }}>
                  <span className="update-btn">...</span>
                </Link>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default List;
