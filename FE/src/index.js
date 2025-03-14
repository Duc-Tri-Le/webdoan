import React from "react";
import ReactDOM from "react-dom/client";
import StoreContextProvider from "../src/context/StoreContext.js";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </React.StrictMode>
);
