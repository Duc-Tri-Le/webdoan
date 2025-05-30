import React, { useContext, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import {StoreContext} from "../../StoreContext/StoreContext"

const Add = () => {
  const API_URL = "http://localhost:4000/api/food/";
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const {token} = useContext(StoreContext)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  // Xử lý chọn ảnh
  const handleFileImage = (e) => {
    const fileImage = e.target.files[0];
    if (fileImage) {
      setImage(URL.createObjectURL(fileImage));
      setImageFile(fileImage);
    }
  };

  // Xử lý thay đổi input
  const onchangeInfo = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Gửi dữ liệu lên server
  const update = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${API_URL}add`, {
        method: "POST",
        headers :{
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "",
        });
        setImage(null);
        setImageFile(null);

        toast.success("Sản phẩm đã được tải lên!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(result.message || "Đã xảy ra lỗi!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      toast.error("Lỗi kết nối đến server!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="Add-wrapper">
      <form className="App-container">
        <div className="upload-image">
          <label htmlFor="image" className="upload-btn">Chọn ảnh</label>
          <input type="file" id="image" onChange={handleFileImage} hidden required />
          {image ? (
            <div>
              <img src={image} alt="Preview" className="image-preview" />
            </div>
          ) : (
            <img src={assets.upload_image} alt="" className="img-upload" />
          )}
        </div>

        <div className="upload-info-input">
          <div className="input-name">
            <p>Product name</p>
            <input
              value={data.name}
              onChange={onchangeInfo}
              placeholder="name"
              type="text"
              name="name"
            />
          </div>
          <div className="input-price">
            <p>Product price</p>
            <input
              value={data.price}
              onChange={onchangeInfo}
              placeholder="price"
              type="text"
              name="price"
            />
          </div>
          <div className="input-description">
            <p>Product description</p>
            <input
              value={data.description}
              onChange={onchangeInfo}
              placeholder="description"
              type="text"
              name="description"
            />
          </div>
        </div>

        <div className="select-category">
          <p>Product category</p>
          <select name="category" value={data.category} onChange={onchangeInfo}>
            <option>Chọn loại</option>
            <option value="beverage">đồ uống</option>
            <option value="combo">combo</option>
            <option value="food">đồ ăn</option>
            <option value="dessert">tráng miệng</option>
          </select>
        </div>

        <div className="btn-upload">
          <button onClick={update}>Upload</button>
        </div>
      </form>
    </div>
  );
};

export default Add;
