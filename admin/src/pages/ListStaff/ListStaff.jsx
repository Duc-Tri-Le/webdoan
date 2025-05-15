import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";

const ListStaff = () => {
  const { URL, token } = useContext(StoreContext);
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();

  const getListStaff = async () => {
    try {
      const response = await fetch(`${URL}/api/user/listStaff`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStaffList(data.data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách nhân viên:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getListStaff();
    }
  }, [token]);

  const handleClick = async () => {
    navigate("/create_staff");
  };

  const handleUpdate = async (staff) => {
    navigate("/grant_role_staff", { state: { staff: staff } });
  };
  return (
    <div className="list-staff-container">
      <button className="add-staff" onClick={handleClick}>
        Add Staff
      </button>
      <h2>Danh Sách Nhân Viên</h2>
      <table className="list-staff-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Name</th>
            <th>ID Staff</th>
            <th>Role</th>
            <th>Working Day</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, index) => (
            <tr key={staff._id}>
              <td>{index + 1}</td>
              <td>{staff.name}</td>
              <td>{staff.mnv}</td>
              <td>{staff.role}</td>
              <td>{new Date(staff.workingDay).toLocaleDateString()}</td>
              <td onClick={() => handleUpdate(staff)}>...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListStaff;
