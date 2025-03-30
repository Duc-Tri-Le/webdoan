import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { useState } from "react";
import LoginAdmin from "../components/LoginAdmin/LoginAdmin";
import "./DefaultLayout.css";

const DefaultLayout = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginAdmin setShowLogin={setShowLogin} /> : <></>}
      <div className="wrapper">
        <div className="header">
          <Header showLogin = {showLogin} setShowLogin={setShowLogin}/>
        </div>
        <div className="container">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
