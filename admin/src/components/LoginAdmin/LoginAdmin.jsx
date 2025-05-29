import React, { useContext, useState } from "react";
import "./LoginAdmin.css";
import { StoreContext } from "../../StoreContext/StoreContext";

const LoginAdmin = ({ setShowLogin }) => {
  const [errorMessage, setErrorMessage] = useState(""); 
  const URL = "http://localhost:4000/api/user/login/staff";
  const { setToken, setUserId } = useContext(StoreContext); 

  // Dữ liệu form
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Xử lý thay đổi input
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Ẩn form đăng nhập
  const setLoginRegistration = () => {
    setShowLogin(false);
  };

  // Gửi dữ liệu đăng nhập lên server
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang mặc định

    try {
      const sendData = {
        email: data.email,
        password: data.password,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const res = await response.json(); 

      if (!response.ok) {
        throw new Error(res.message || "Login failed! Please check your email and password.");
      }

      if (res.success) {
        setToken(res.data.token); 
        setUserId(res.data.staff._id)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.staff._id)
        setShowLogin(false); 
      }
    } catch (error) {
      setErrorMessage(error.message); 
    }
  };

  return (
    <div className="container-login-regis">
      <form className="login-regis-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>} {/* Hiển thị lỗi nếu có */}
        <div className="login_popup_input">
          <input
            type="email"
            placeholder="Email"
            className="input_here"
            value={data.email}
            name="email"
            onChange={handleOnChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input_here"
            name="password"
            value={data.password}
            onChange={handleOnChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <button type="button" className="close_btn" onClick={setLoginRegistration}>
          Close
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
