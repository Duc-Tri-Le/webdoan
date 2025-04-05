import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../StoreContext/StoreContext";

const CreateStaff = () => {
  const navigate = useNavigate();
  const { URL } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
    mnv: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/api/user/createStaff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        navigate("/list_staff"); // Điều hướng đến danh sách nhân viên
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("Lỗi khi tạo nhân viên:", error);
    }
  };

  return (
    <div className="create-staff-container">
      <form onSubmit={handleCreateStaff} className="create-staff-form">
        <h2>Tạo Nhân Viên</h2>
        <div className="create-staff-wrapper">
          <input
            type="email"
            value={data.email}
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={data.name}
            name="name"
            onChange={handleChange}
            placeholder="Tên"
            required
          />
          <input
            type="password"
            value={data.password}
            name="password"
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
          />
          <input
            type="text"
            value={data.mnv}
            name="mnv"
            onChange={handleChange}
            placeholder="Mã nhân viên"
            required
          />
        </div>
        <div className="select-role">
          <p>Vai trò</p>
          <select name="role" value={data.role} onChange={handleChange} required>
            <option value="seller">Seller</option>
            <option value="shipper">Shipper</option>
          </select>
        </div>
        <div className="button-submit">
          <button type="submit">Tạo Nhân Viên</button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;
