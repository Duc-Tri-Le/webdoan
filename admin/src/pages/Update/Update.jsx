import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import "./Update.css";
import { useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";

const Update = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { token } = useContext(StoreContext);

  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = "http://localhost:4000";

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
        const response = await axios.get(
          `${API_URL}/api/food/detail-food/${foodId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
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
    const imageFood = e.target.files[0];
    setImageFile(imageFood);
    setImagePreview(URL.createObjectURL(imageFood));
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

    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      toast.error("Bạn chưa đăng nhập!");
      return;
    }

    const formData = new FormData();
    formData.append("name", String(foodData.name));
    formData.append("price", String(foodData.price));
    formData.append("description", String(foodData.description));
    formData.append("category", String(foodData.category));

    if (imageFile) {
      formData.append("image", imageFile);
    }
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": ", pair[1]);
    // }
    try {
      const response = await axios.put(
        `${API_URL}/api/food/update-food/${foodId}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật thành công!");
        navigate("/list-item");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  if (!foodData) return <p>Loading...</p>;
  // console.log(foodData);
  return (
    <div>
      <h2>Cập nhật món ăn</h2>
      <form onSubmit={handleUpdate}>
        <label htmlFor="image" className="upload-btn">
          Chọn ảnh
        </label>
        <div className="upload-img">
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            hidden
          />
          <div>
            {imagePreview ? (
              <img src={imageFile} alt="" className="img-preview" />
            ) : (
              <img
                src={`${API_URL}/${foodData.image}`}
                alt=""
                className="img-preview"
              />
            )}
          </div>
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
