import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const CompletePayment = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const { URL, token } = useContext(StoreContext);
  const [orderData, setOrderData] = useState(null); // Đặt mặc định là null
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`${URL}/api/order/detail-order/${orderId}`, {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu đơn hàng');
          }

          const data = await response.json();
          setOrderData(data.data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false); // Dữ liệu đã được tải
        }
      };

      fetchOrder();
    }
  }, [orderId, URL, token]);

  const handleClick = (e) => {
    e.preventDefault();
    if (orderData) {
      navigate("/bill", { state:  orderData  });
    }
  };

  if (loading) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }
  console.log(orderData);
  return (
    <div className='completePayment-container'>
      <div className='completePayment-wrapper'>
        <div>Đơn hàng đã được đặt</div>
        <div className='detail-order' onClick={handleClick}>
          <h3>Xem chi tiết đơn hàng</h3>
        </div>
      </div>
    </div>
  );
};

export default CompletePayment;
