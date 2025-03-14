import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import "./Update.css"

const Update = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = "http://localhost:4000/api/food/";

  const food = location.state?.food;
  const foodId = food?._id;

  const [foodData, setFoodData] = useState(food || {});

  useEffect(() => {
    if (!foodId) {
      toast.error("Không có dữ liệu!");
      navigate("/list-item");
      return;
    }

    const fetchFood = async () => {
      try {
        const response = await axios.get(`${API_URL}detail-food/${foodId}`);
        if (response.data.success) {
          setFoodData(response.data.data);
        }
      } catch (error) {
        toast.error("Lỗi lấy dữ liệu!");
        navigate("/list-item");
      }
    };

    if (!food) fetchFood();
  }, [foodId, navigate, food]);

  const handleFileChange = (e) => {
    setFoodData({ ...foodData, image: e.target.files[0] });
    const imageFood = e.target.files[0];
    setImage(URL.createObjectURL(imageFood));
    setImageFile(imageFood);
  };

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!foodData.name || !foodData.price) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}update-food/${foodId}`,
        foodData
      );
      if (response.data.success) {
        toast.success("Cập nhật thành công!");
        navigate("/list-item");
      }
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  if (!foodData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Cập nhật món ăn</h2>
      <form onSubmit={handleUpdate}>
      <label htmlFor="image" className="upload-btn">Chọn ảnh</label>
        <div className="upload-img">
          <input
            type="file"
            name="image"
            id = "image"
            onChange={handleFileChange}
            hidden
            required
          />
          {image ? (
            <div>
              <img src={image} alt="" className="img-preview" />
            </div>
          ) : (
            <img src={assets.upload_image} alt="" className="img-upload" />
          )}
        </div>
        <label>Tên:</label>
        <input
          type="text"
          name="name"
          value={foodData.name}
          onChange={handleChange}
        />

        <label>Giá:</label>
        <input
          type="number"
          name="price"
          value={foodData.price}
          onChange={handleChange}
        />

        <label>Mô tả:</label>
        <textarea
          name="description"
          value={foodData.description}
          onChange={handleChange}
        ></textarea>

        <div className="select-category">
          <p>Product category</p>
          <select
            name="category"
            value={foodData.category}
            onChange={handleChange}
          >
            <option value="salad">Salad</option>
            <option value="drink">Drink</option>
            <option value="chicken">Chicken</option>
            <option value="duck">Duck</option>
          </select>
        </div>

        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default Update;
