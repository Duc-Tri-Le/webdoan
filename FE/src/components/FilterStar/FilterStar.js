import React from 'react'

const FilterStar = ({startRating, setStartRating}) => {

    const handleChange = (e) => {
        setStartRating(e.target.value)
    }
  return (
    <div className="filter-review-rating">
        <span>Lọc đánh giá</span>
        <select onChange={handleChange}>
          <option value="">Tất cả</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
  )
}

export default FilterStar
