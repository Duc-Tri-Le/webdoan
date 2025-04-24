import React from "react";

const SortBy = ({ SortBy, setSortBy }) => {
  const handleChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="sort-by">
      <select className="select-sort-buy" onChange={handleChange}>
        <option value="">-- Giá --</option>
        <option value="tăng dần">Giá tăng dần</option>
        <option value="giảm dần">Giá giảm dần</option>
        <option value="đánh giá cao">Đánh giá cao</option>
      </select>
    </div>
  );
};

export default SortBy;
