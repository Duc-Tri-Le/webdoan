import crypto from "crypto";
import moment from "moment";
import querystring from 'qs';

const createVnPay = async (order, req) => {
  if (!order || !order.total_price) {
    throw new Error("Invalid order data");
  }

  const orderId = order._id.toString();
  const vnp_TmnCode = process.env.vnp_TmnCode;
  const vnp_HashSecret = process.env.vnp_HashSecret;
  const vnp_Url = process.env.vnp_Url;
  const vnp_ReturnUrl = `${process.env.FRONTEND_URL}/complete-payment?orderId=${orderId}`;
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    "127.0.0.1"; // fallback IP

  const vnp_CreateDate = moment().format("YYYYMMDDHHmmss");
  const vnp_Amount = order.total_price * 100;

  const vnp_params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate,
  };
  
  // 1. Sắp xếp tham số
  const sortedParams = sortObject(vnp_params);
  // console.log(sortedParams);
  //tim xem cos obj hay ko
  for (const key in sortedParams) {
    if (typeof sortedParams[key] === 'object') {
      console.log(`Lỗi: ${key} có kiểu object:`, sortedParams[key]);
    }
  }
  // 2. Tạo chuỗi dữ liệu ký
  const urlParams = new URLSearchParams();
  for (let [key, value] of Object.entries(sortedParams)) {
    urlParams.append(key, value);
  }
  const querystring = urlParams.toString();
  // const signData = querystring.stringify(sortedParams, { encode: false });
  // console.log(signData);
  // 3. Tạo chữ ký SHA512
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const secureHash = hmac.update(new Buffer.from(querystring, "utf-8")).digest("hex");
  // console.log(secureHash);
  // 4. Gộp tham số cuối
  urlParams.append("vnp_SecureHash", secureHash);
  // 5. Tạo URL thanh toán
  const paymentUrl = `${vnp_Url}?${urlParams.toString()}`;
  console.log(paymentUrl);
  return paymentUrl;
};

// Hàm sắp xếp object theo thứ tự key
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export default createVnPay;
