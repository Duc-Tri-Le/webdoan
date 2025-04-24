import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../StoreContext/StoreContext";

const GrantRole = () => {
  const { state } = useLocation();
  const staff = state?.staff;
  const navigate = useNavigate();
  const { URL, token } = useContext(StoreContext);

  const [data, setData] = useState({
    role: staff?.role || "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGrantRole = async (e) => {
    e.preventDefault();

    if (!staff) {
      console.log("No staff found");
      return;
    }

    try {
      const response = await fetch(`${URL}/api/user/grantRole/${staff._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json(); 

      if (responseData.success) {
        navigate("/list_staff");
      } else {
        console.error("Error updating role:", responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!staff) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="grant-role-container">
      <form onSubmit={handleGrantRole} className="grant-role-form">
        <h2>Cập Nhật Vai Trò Nhân Viên</h2>
        <div className="grant-role-wrapper">
          <p>Name : {staff.name}</p>
          <p>Email : {staff.email}</p>
          <p>Phone : {staff.phone}</p>
          <p>DOB : {staff.DOB}</p>
          <p>Working Day : {staff.workingDay}</p>
        </div>
        <div className="select-role">
          <p>Vai trò</p>
          <select
            name="role"
            value={data.role}
            onChange={handleChange}
            required
          >
            <option value="seller">Seller</option>
            <option value="shipper">Shipper</option>
          </select>
        </div>
        <div className="button-submit">
          <button type="submit">Cập nhật</button>
        </div>
      </form>
    </div>
  );
};

export default GrantRole;
