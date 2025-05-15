import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { publicRoutes } from "./Routes";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function ScrollToSection(){
  const {hash} = useLocation();
  React.useEffect(() => {
    if(hash){
      const target = document.querySelector(hash);
      if(target){
        target.scrollIntoView({ behavior: "smooth" })
      }
    }
  },[hash])
  return null;
}
const App = () => {
  return (
    <Router>
      <ScrollToSection/>
      <div className="app">
        <Routes>
          {publicRoutes.map((route,index) => {
            const Page = route.component;
            const LayOut = DefaultLayout;
            return (
              <Route
              key = {index}
              path= {route.path}
              element = {
                <LayOut>
                  <Page/>
                </LayOut>
              }/>
            )
          })}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
