import orderModel from "../../models/orderModel.js";
import crypto from "crypto";
import sendOrderEmail from "../../utils/sendMail.js";
import userModel from "../../models/userModel.js";

const handelWebHookMoMo = async (req, res) => {
  try {
    console.log("webhook receive: ", req.body);
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    const accessKey = "F8BBA842ECF85";
    const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    // Mã hóa HMAC SHA256 để tạo chữ ký

    const expectedSignature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log(" Signature không khớp!");
      console.log(expectedSignature);
      console.log(signature);
      return res.status(400).send("Invalid signature");
    }

    if (Number(resultCode) === 0) {
      const order = await orderModel
        .findByIdAndUpdate(
          orderId,
          {
            payment_status: true,
          },
          { new: true }
        )
        .populate("user_id")
        .populate("item.foodId");
      // console.log(order);
      if (order?.user_id?.email) {
        await sendOrderEmail(order.user_id.email, order,"success");
      }
      console.log("Thanh toán thành công với MoMo!");
      res.status(200).send("OK");
    } else {
      console.log("Thanh toán thất bại từ MoMo!");
      res.status(500).send("FAIL");
    }

  } catch (error) {
    console.error("Lỗi xử lý webhook MoMo:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export default handelWebHookMoMo;
