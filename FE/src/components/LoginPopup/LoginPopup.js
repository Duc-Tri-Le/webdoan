import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import Registration from "../Registration/Registration";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const URL = "http://localhost:4000/api/user/login"; 
  const [showRegistration, setShowRegistration] = useState(false);
  const {setToken, setUserId} = useContext(StoreContext)

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleOnchange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), 
      });

      if (!response.ok) {
        throw new Error("Login failed! Please check your email and password.");
      }

      const res = await response.json();

      if (res.success) {
        console.log("Login successful:", res.data);
        setToken(res.data.token)
        localStorage.setItem("token", res.data.token); 
        //luu userId vao localStorage
        setUserId(res.data.user._id)
        localStorage.setItem("userId", res.data.user._id)
        setShowLogin(false);
      } else {
        setErrorMessage(res.message || "Login failed!"); 
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

          {errorMessage && <p className="error">{errorMessage}</p>} 

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
