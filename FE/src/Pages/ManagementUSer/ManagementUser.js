import React, { useState, useEffect } from "react";
import {useLocation} from "react-router-dom";
import ManagementOrder from "../../components/ManagementOrder/ManagementOrder.js";
import ManagementUserIf from "../../components/ManagementUserIf/ManagementUserIf.js";
import "./ManagementUser.css";

const ManagementUser = () => {

  const [showOrder, setShowOrder] = useState(false);
  const [stateOrder, setStateOrder] = useState("All");
  const [showUser, setShowUser] = useState(false);
  const {state} = useLocation()

  useEffect(() => {
    if (state?.showOrder) {
      setShowOrder(true);
      setShowUser(false)
    } else if (state?.showUser) {
      setShowUser(true);
      setShowOrder(false)
    }
  }, [state]);

  const changeStateShowOrder = () => {
    setStateOrder("All");
    setShowOrder(true);
    setShowUser(false);
  };

  const handleAccount = () => {
    setShowOrder(false);
    setShowUser(true);
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        {/* <div className="notification" onClick={() => setShowOrder(false)}>Notification</div> */}
        <div className="profile" onClick={handleAccount}>
          <span>My account</span>
        </div>
        <div className="list-order" onClick={changeStateShowOrder}>
          Orders
        </div>
      </div>
      {showOrder ? (
        <ManagementOrder
          stateOrder={stateOrder}
          setStateOrder={setStateOrder}
          setShowOrder = {setShowOrder}
          showOrder = {showOrder}
        />
      ) : // <></>
      null}
      {showUser && !showOrder ? (
       <ManagementUserIf showUser ={showUser} setShowUser = {setShowUser}/>
      ) : null}
    </div>
  );
};

export default ManagementUser;
