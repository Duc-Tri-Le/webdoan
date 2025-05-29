import React, { useState } from "react";
import Header from "../Header/Header.js";
import "./DefaultLayout.css";
import Footer from "../Footer/Footer.js";
import AppDownLoad from "../AppDownload/AppDownload.js";
import LoginPopup from "../LoginPopup/LoginPopup.js";
import ChatBox from "../ChatBox/ChatBox.js";

const DefaultLayout = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="Wrapper">
        <Header setShowLogin = {setShowLogin}/>
        <div className="content">{children}</div>
        <ChatBox/>
        <AppDownLoad />
        <Footer />
      </div>
      </>
  );
};

export default DefaultLayout;
