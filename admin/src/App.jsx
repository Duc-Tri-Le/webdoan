import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRouter } from "../src/Router/Router";
import DefaultLayout from "./Layout/DefaultLayout";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {PrivateRouter.map((item, index) => {
          const Page = item.component;
          const Layout = DefaultLayout;
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
};

export default App;
