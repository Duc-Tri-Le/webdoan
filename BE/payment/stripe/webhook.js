import orderModel from "../../models/orderModel.js";
import stripe from "../../utils/stripeUtils.js";
import sendOrderEmail from "../../utils/sendMail.js";

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

  if (event.type === "checkout.session.completed") {
    const sessionId = event.data.object.id;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const userId = session.metadata.userId;
      const orderId = session.metadata.orderId;
      const paymentIntentId = session.payment_intent;
      console.log("payment", paymentIntentId);

      const order = await orderModel
        .findByIdAndUpdate(
          orderId,
          {
            payment_status: true,
            payment_intent: paymentIntentId, 
          },
          { new: true }
        )
        .populate("user_id")
        .populate("item.foodId");

      if (order?.user_id?.email) {
        await sendOrderEmail(order.user_id.email, order, "success");
      }

      console.log("Cập nhật đơn hàng thành công:", orderId);
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn hàng:", err.message);
    }
  }

  // Thanh toán thất bại hoặc hết hạn
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "payment_intent.canceled"
  ) {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await orderModel.findById(orderId).populate("user_id");

        if (order?.user_id?.email) {
          await sendOrderEmail(order.user_id.email, order, "fail");
        }
      } catch (err) {
        console.error("Lỗi khi gửi email thất bại:", err.message);
      }
    }
  }

  // Hoàn tiền
  if (
    event.type === "refund.created" ||
    event.type === "refund.succeeded" ||
    event.type === "refund.failed"
  ) {
    const refund = event.data.object;
    const paymentIntentId = refund.payment_intent;

    const order = await findOrder(paymentIntentId);
    if (!order) {
      console.log("Không tìm thấy đơn hàng tương ứng với refund");
    }

    switch (event.type) {
      case "refund.created":
        console.log(`Refund succeeded for order ${order?._id}`);
        await updateOrder(order._id, {
          refund_id: refund.id,
          refund_status: "Succeeded",
          status: "returned",
          refund_amount: refund.amount,
        });

        if (order?.user_id?.email) {
          await sendOrderEmail(order.user_id.email, order, "refund");
        }
        break;

      case "refund.failed":
        console.error(`Refund failed for order ${order?._id}`);
        await updateOrder(order._id, { refund_status: "Failed" });
        if (order?.user_id?.email) {
          await sendOrderEmail(order.user_id.email, order, "Failed");
        }
        break;
    }
  }

  res.json({ received: true });
};

const findOrder = async (paymentIntentId) => {
  return await orderModel.findOne({ payment_intent: paymentIntentId });
};

const updateOrder = async (orderId, updateData) => {
  return await orderModel.findByIdAndUpdate(
    orderId,
    { ...updateData, order_return: new Date() },
    { new: true }
  ).populate("user_id")
  .populate("item.foodId");;
};

export default handelWebHook;
