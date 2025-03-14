import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import Registration from "../Registration/Registration";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const URL = "http://localhost:4000/api/user/login"; // Đảm bảo API đúng
  const [showRegistration, setShowRegistration] = useState(false);
  const {setToken} = useContext(StoreContext)

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu lỗi

  const handleOnchange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Xóa lỗi cũ trước khi đăng nhập

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Chuyển object thành JSON
      });

      if (!response.ok) {
        throw new Error("Login failed! Please check your email and password.");
      }

      const res = await response.json();

      if (res.success) {
        console.log("Login successful:", res.data);
        setToken(res.data.token)
        localStorage.setItem("token", res.data.token); // Lưu token vào localStorage
        setShowLogin(false);
      } else {
        setErrorMessage(res.message || "Login failed!"); // Hiển thị lỗi từ server
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login_popup">
      {showRegistration ? (
        <Registration
          setShowRegistration={setShowRegistration}
          setShowLogin={setShowLogin}
        />
      ) : (
        <form className="login_popup_form" onSubmit={handleLogin} id="my-form">
          <div className="login_popup_title">
            <h2 className="title">Login</h2>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>} {/* Hiển thị lỗi */}

          <div className="login_popup_input">
            <input
              type="email"
              placeholder="Email"
              className="input_here"
              value={data.email}
              name="email"
              onChange={handleOnchange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input_here"
              name="password"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          <button type="submit">Login</button>
          <button type="button" className="close_btn" onClick={() => setShowLogin(false)}>
            Close
          </button>
          <button type="button" className="sign_up" onClick={() => setShowRegistration(true)}>
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginPopup;
