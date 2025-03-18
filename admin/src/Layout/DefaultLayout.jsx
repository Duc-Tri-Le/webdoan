import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Header from '../components/Header/Header'
import "./DefaultLayout.css"

const DefaultLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <header className="header">
        <Header />
      </header>
      <div className="container">
        <aside className="sidebar">
          <Sidebar />
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout
