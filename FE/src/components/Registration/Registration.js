import React, { useContext, useState } from "react";
import "./Registration.css";
import { StoreContext } from "../../context/StoreContext";

const Registration = ({ setShowRegistration, setShowLogin }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const {setToken, setUserId} = useContext(StoreContext)
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const URl = "http://localhost:4000/api/user/register";

  const handleRegister = async (e) => {
    e.preventDefault(); // Ngăn form reload

    if (data.password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await fetch(URl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        // Lưu token vào localStorage
        setToken(result.data.token)
        localStorage.setItem("token", result.data.token);

        //luu userId vao localStorage
        setUserId(result.data.id)
        localStorage.setItem("userId", result.data.id)
        
        setShowRegistration(false);
        setShowLogin(false); 
      } else {
        alert(result.message); 
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Đăng ký thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="register_popup">
      <form className="register_form" onSubmit={handleRegister}>
        <h2 className="register_title">Sign Up</h2>
        <div className="register_input">
          <input
            type="text"
            placeholder="Username"
            className="input_field"
            name="name"
            value={data.name}
            onChange={handleOnChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input_field"
            name="email"
            value={data.email}
            onChange={handleOnChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input_field"
            name="password"
            value={data.password}
            onChange={handleOnChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input_field"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register_button">
          Sign Up
        </button>
        <button type="button" onClick={() => setShowRegistration(false)}>
          Close
        </button>
        <span
          onClick={() => {
            setShowRegistration(false);
            setShowLogin(true);
          }}
        >
          Login here
        </span>
      </form>
    </div>
  );
};

export default Registration;
