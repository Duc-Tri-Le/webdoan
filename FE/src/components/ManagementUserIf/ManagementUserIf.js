import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";

const ManagementUserIf = ({ showUSer, setShowUser }) => {

    const {URL, dataUSer, getUSerIf, token} = useContext(StoreContext)
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    DOB: "",
    role: "user",
  });

  useEffect(() => {
    if (dataUSer) {
      setEditData({
        name: dataUSer.name || "",
        email: dataUSer.email || "",
        phone: dataUSer.phone || "",
        DOB: dataUSer.DOB || "",
        role: dataUSer.role || "user",
      });
    }
  }, [dataUSer]);
  
  const updateUSer = async () => {
    try {
      const update = await fetch(`${URL}/api/user/update`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      const user = await update.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = () => {
    updateUSer();
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (token) {
      getUSerIf();
    }
  }, [token]);

  return (
    <div className="account-info">
      <label>
        <strong>Họ tên:</strong>
      </label>
      <input name="name" value={editData.name} onChange={handleChange} />

      <label>
        <strong>Email:</strong>
      </label>
      <input
        name="email"
        value={editData.email}
        onChange={handleChange}
        disabled
      />

      <label>
        <strong>Số điện thoại:</strong>
      </label>
      <input
        name="phone"
        value={editData.phone}
        onChange={handleChange}
        placeholder="Chưa cập nhật"
      />

      <label>
        <strong>Ngày sinh:</strong>
      </label>
      <input
        name="DOB"
        type="date"
        value={editData.DOB}
        onChange={handleChange}
      />

      <label>
        <strong>Vai trò:</strong>
      </label>
      <input name="role" value={editData.role} disabled />

      <button onClick={handleSave}>Lưu thay đổi</button>
    </div>
  );
};

export default ManagementUserIf;
