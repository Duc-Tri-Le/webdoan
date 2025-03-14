import React from "react";
import "./Footer.css";

const footerData = [
  {
    title: "FoodHero",
    items: ["Giới thiệu", "Hợp tác", "Tuyển dụng", "Liên hệ"],
  },
  {
    title: "Trợ giúp",
    items: [
      "Hình thức thanh toán",
      "Bảng giá giao hàng",
      "Khu vực giao hàng",
      "Hướng dẫn đặt món",
    ],
  },
  {
    title: "Thông tin liên lạc",
    items: ["Địa chỉ", "Email", "Số điện thoại", "Facebook"],
  },
  {
    title: "Thiết kế web bởi",
    items: ["Tên", "Địa chỉ", "Số điện thoại liên lạc", "Email"],
  },
];

const Footer = () => {
  return (
    <div className="footer_wrapper" id = "footer">
      <div className="footer_container">
        {footerData.map((section, index) => (
          <div key={index} className="footer_section">
            <h3>{section.title}</h3>
            {section.items.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="footer_bottom"></div>
    </div>
  );
};

export default Footer;
