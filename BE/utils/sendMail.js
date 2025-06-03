import nodemailer from "nodemailer";

const sendOrderEmail = async (toEmail, order, payment) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       
        pass: process.env.EMAIL_PASSWORD,    
      },
    });
    
    let mailOptions;
    if(payment === "success"){
      mailOptions = {
        from: `"Food App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận đơn hàng",
        html: `
          <h3>Xin chào!</h3>
          <p>Bạn đã đặt hàng thành công với nội dung:</p>
          <ul>
            <li>Mã đơn hàng: ${order._id}</li>
            ${order.item?.map(item => `<li>${item.foodId.name}</li>`).join('')}
            <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
            <li>Thời gian: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
      };
    }else if(payment === "refund"){
      mailOptions = {
        from: `"Food App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận hoàn tiền",
        html: `
          <h3>Xin chào!</h3>
          <p>Bạn đã hoàn tiền thành công với nội dung:</p>
          <ul>
            <li>Mã đơn hàng: ${order._id}</li>
            ${order.item?.map(item => `<li>${item.foodId.name}</li>`).join('')}
            <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
            <li>Thời gian: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
      };
    }else if(payment === "fail"){
      mailOptions = {
        from: `"Food App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận thanh toán thất bại",
        html: `
          <h3>Xin chào!</h3>
          <p>Bạn đã thanh toán thất bại với nội dung:</p>
          <ul>
            <li>Mã đơn hàng: ${order._id}</li>
            ${order.item?.map(item => `<li>${item.foodId.name}</li>`).join('')}
            <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
            <li>Thời gian: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi, và vui lòng thanh toán lại!</p>
        `,
      };
    }else if(payment === "pending"){
      mailOptions = {
        from: `"Food App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận hoàn tiền",
        html: `
          <h3>Xin chào!</h3>
          <p>Bạn đang trong tình trạng chờ xác nhận hàn tiền với nội dung:</p>
          <ul>
            <li>Mã đơn hàng: ${order._id}</li>
            ${order.item?.map(item => `<li>${item.foodId.name}</li>`).join('')}
            <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
            <li>Thời gian: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
      };
    }else if(payment === "Failed"){
      mailOptions = {
        from: `"Food App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận hoàn tiền",
        html: `
          <h3>Xin chào!</h3>
          <p>Hòn tiền thất bại:</p>
          <ul>
            <li>Mã đơn hàng: ${order._id}</li>
            ${order.item?.map(item => `<li>${item.foodId.name}</li>`).join('')}
            <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
            <li>Thời gian: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
      };
    }else if(payment === "refused"){
      mailOptions = {
        from: `"Food App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận hoàn tiền",
        html: `
          <h3>Xin chào!</h3>
          <p>Từ chối hoàn tiền:</p>
          <ul>
            <li>Mã đơn hàng: ${order._id}</li>
            ${order.item?.map(item => `<li>${item.foodId.name}</li>`).join('')}
            <li>Tổng tiền: ${order.total_price.toLocaleString()} VND</li>
            <li>Thời gian: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
      };
    }

    await transporter.sendMail(mailOptions);
    console.log("Đã gửi email xác nhận đơn hàng!");
  } catch (error) {
    console.error("Lỗi gửi email:", error.message);
  }
};

export default sendOrderEmail;
