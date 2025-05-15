import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";

function ProductRecommendation() {
  const { list, updateRecommendation } = useContext(StoreContext);
  const [localList, setLocalList] = useState([]);

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  const toggleRecommendation = (id) => {
    setLocalList((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isRecommended: !p.isRecommended } : p
      )
    );
  };
  console.log(localList);

  const handleSave = async () => {

    try {
      await updateRecommendation(localList);
      alert("Cập nhật thành công! Trang sẽ được tải lại.");
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi lưu khuyến nghị:", err);
      alert("Lỗi server, vui lòng thử lại sau.");
    }
  };

  return (
    <div>
      <h2>Quản lý sản phẩm khuyến nghị</h2>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Khuyến nghị</th>
          </tr>
        </thead>
        <tbody>
          {localList.map((product, idx) => (
            <tr key={product._id}>
              <td>{idx + 1}</td>
              <td>{product.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={product.isRecommended}
                  onChange={() => toggleRecommendation(product._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} style={{ marginTop: 16, padding: "8px 16px" }}>
        Lưu thay đổi
      </button>
    </div>
  );
}

export default ProductRecommendation;
