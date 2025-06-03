import React, { useContext, useState } from "react";
import { StoreContext } from "../../StoreContext/StoreContext";
import Management_Order from "../../components/Management_Order/Management_Order";
import SearchOrder from "../../components/Search/SearchOrder";

const OrderManagement = () => {
  const { allOrder } = useContext(StoreContext);
  const [searchReach, setSearchResult] = useState([]);

  //phan trang
  const orderPage = 10;
  const totalPage = allOrder.length > 0 ? Math.ceil(allOrder.length / orderPage) : 0;
  const [currentPage, setCurrentPae] = useState(1);
  const startIndex = (currentPage - 1) * orderPage;
  const listOrderPage =
    searchReach.length > 0
      ? searchReach.slice(startIndex, orderPage + startIndex)
      : allOrder.slice(startIndex, orderPage + startIndex);

  const getNumberPage = () => {
    const page = [];
    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        page.push(i);
      }
    } else {
      if (currentPage <= 4) {
        page.push(1, 2, 3, 4, 5, "...", totalPage);
      } else if (currentPage > totalPage - 4) {
        page.push(
          1,
          "...",
          totalPage - 4,
          totalPage - 3,
          totalPage - 2,
          totalPage - 1,
          totalPage
        );
      } else {
        page.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPage
        );
      }
    }
    return page;
  };

  const handelChangePage = (numberPage) => {
    setCurrentPae(numberPage);
  };

  
  return (
    <div className="order-management-wrapper">
      <div className="order-management-search">
        <SearchOrder setSearchResult={setSearchResult} />
      </div>
      <div className="order-management-container">
        {searchReach.length > 0
          ? searchReach.map((item) => {
              return <Management_Order item={item} />;
            })
          : listOrderPage.map((item) => {
              return <Management_Order item={item} />;
            })}
      </div>
      <div className="number-page-order-management">
        <button
          className="arrow-btn"
          disabled={currentPage === 1}
          onClick={() => handelChangePage(currentPage - 1)}
        >
          &lt;
        </button>

        {getNumberPage().map((number, index) => (
          <button
            onClick={() => handelChangePage(number)}
            key={index}
            className={`page-btn ${number === currentPage ? "active" : ""} ${
              number === "..." ? "dots" : ""
            }`}
            disabled={number === "..."}
          >
            {number}
          </button>
        ))}

        <button
          className="arrow-btn"
          disabled={currentPage === totalPage}
          onClick={() => handelChangePage(currentPage + 1)}
        >
          &gt;
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default OrderManagement;
