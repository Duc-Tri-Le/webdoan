import orderModel from "../../models/orderModel.js";
import stripe from "../../utils/stripeUtils.js";

const endpointsSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handelWebHook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointsSecret);
  } catch (errors) {
    console.error("Xác thực thất bại:", errors.message);
    return res.status(400).send(`Webhook Error: ${errors.message}`);
  }

  // Khi thanh toán thành công
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Webhook fired! Session ID:", session.id);
    console.log("Metadata:", session.metadata);

    const userId = session.metadata.userId;
    const orderId = session.metadata.orderId;

    try {
      await orderModel.findByIdAndUpdate(orderId, {
        payment_status: true,
      },{ new: true });
      console.log("Cập nhật đơn hàng thành công:", orderId);
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn hàng:", err.message);
    }
  }

  // Khi thanh toán thất bại hoặc hết hạn
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        console.log(
          "Đã xoá đơn hàng tạm thời do thanh toán thất bại:",
          orderId
        );
      } catch (err) {
        console.error("Lỗi khi xoá đơn hàng:", err.message);
      }
    }
  }

  res.json({ received: true});
};

export default handelWebHook;
