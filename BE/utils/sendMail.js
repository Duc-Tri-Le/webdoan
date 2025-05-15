import nodemailer from "nodemailer";

const sendOrderEmail = async (toEmail, order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       
        pass: process.env.EMAIL_PASSWORD,    
      },
    });

    const mailOptions = {
      from: `"Food App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Xác nhận đơn hàng",
      html: `
        <h3>Xin chào!</h3>
        <p>Bạn đã đặt hàng thành công với nội dung:</p>
        <ul>
          <li>Mã đơn hàng: ${order._id}</li>
          
          <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
          <li>Thời gian: ${new Date().toLocaleString()}</li>
        </ul>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Đã gửi email xác nhận đơn hàng!");
  } catch (error) {
    console.error("Lỗi gửi email:", error.message);
  }
};

export default sendOrderEmail;
