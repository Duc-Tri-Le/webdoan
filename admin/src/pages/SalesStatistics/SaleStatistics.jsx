import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./SaleStatistic.css";
import ChartSale from "../../components/ChartSale/ChartSale";
import { StoreContext } from "../../StoreContext/StoreContext";

const SaleStatistics = () => {
  const [type, setType] = useState("day");
  const [from, setFrom] = useState("2025-06-01");
  const [to, setTo] = useState("2025-06-05");
  const [data, setData] = useState([]);
  const { URL } = useContext(StoreContext);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(`${URL}/api/revenue/time`, {
        params: { type, from, to },
      });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching revenue:", err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [type, from, to]);

  return (
    <div className="sale-report">
      <div className="report-container">
        <h2 className="report-title">Báo cáo doanh thu</h2>
        <div className="report-filters">
          <div className="filter-group">
            <label>Kiểu báo cáo:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <table className="report-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Tổng đơn</th>
              <th>Doanh thu</th>
              <th>Hoàn tiền</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((d) => (
                <tr key={d._id}>
                  <td>{d._id}</td>
                  <td>{d.totalOrders}</td>
                  <td>{d.totalRevenue.toLocaleString()}đ</td>
                  <td>{d.totalRefund.toLocaleString()}đ</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="chart-sale">
        <ChartSale data={data}/>
      </div>
    </div>
  );
};

export default SaleStatistics;
