import React, { useState } from "react";
import Header from "../Header/Header.js";
import "./DefaultLayout.css";
import Footer from "../Footer/Footer.js";
import AppDownLoad from "../AppDownload/AppDownload.js";
import LoginPopup from "../LoginPopup/LoginPopup.js";

const DefaultLayout = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="Wrapper">
        <Header setShowLogin = {setShowLogin}/>
        <div className="content">{children}</div>
        <AppDownLoad />
        <Footer />
      </div>
      </>
  );
};

export default DefaultLayout;
