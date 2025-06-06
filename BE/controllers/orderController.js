import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import createStripe from "../payment/stripe/createStripe.js";
import createVnPay from "../payment/vnPay/createVnPay.js";
import createMoMo from "../payment/momo/createMomo.js";
import stripe from "../utils/stripeUtils.js";
import sendOrderEmail from "../utils/sendMail.js";

import dotenv from "dotenv";

dotenv.config();

const getOrder = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const orders = await orderModel
      .find({ user_id: req.userId })
      .populate("item.foodId")
      .populate("address");
    const resOrder = orders.sort((a, b) => b.updatedAt - a.updatedAt);
    return res.json({ success: true, data: resOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    const {
      delivery_fee,
      address,
      payment_method,
      item,
      total_price,
      paymentGateway,
    } = req.body;

    let payment_id = null;
    let payment_status = false;
    let order;

    const items = item.map((item) => ({
      foodId: item._id,
      quantity: item.quantity,
    }));

    const order_create = new Date();

    order = new orderModel({
      user_id: req.userId,
      total_price,
      item: items,
      delivery_fee,
      address,
      payment_status,
      payment_method,
      payment_id,
      order_create,
      payment_gateAway: paymentGateway,
    });

    await order.save();

    await cartModel.findOneAndDelete({ user_id: req.userId });

    if (payment_method === "online") {
      if (paymentGateway === "stripe") {
        // Dùng Stripe thanh toán thẻ
        const { url } = await createStripe(
          item,
          delivery_fee,
          total_price,
          req.userId,
          order._id.toString()
        );
        return res.status(200).json({ url });
      } else if (paymentGateway === "vnPay") {
        const vnpayUrl = await createVnPay(order, req);
        return res.status(200).json({ url: vnpayUrl });
      } else if (paymentGateway === "MoMo") {
        const moMoURL = await createMoMo(order);

        return res.status(200).json({ url: moMoURL });
      }
    }

    const ordered = await order.populate("item.foodId");
    return res
      .status(200)
      .json({ success: true, message: "Order created", ordered: ordered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// const removeOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const orderId = id

//     if (!orderId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Order ID is required" });
//     }

//     const order = await orderModel.findByIdAndDelete(orderId);

//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Order removed successfully",
//         data: order,
//       });
//   } catch (error) {
//     console.error("Error removing order:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

const getListAdminOrder = async (req, res) => {
  try {
    const adminOrders = await orderModel
      .find({})
      .populate("item.foodId", "name price image");

    res.status(200).json({ success: true, data: adminOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { orderId, state } = req.body;
    let payment_status = false;
    if (!orderId || !state) {
      return res.status(404).json({ success: false, message: "no found" });
    }

    const order = await orderModel.findById(orderId);
    if (order.payment_status === false && state === "shipped") {
      payment_status = true;
    } else {
      payment_status = order.payment_status;
    }

    const orderUpdate = { state, payment_status };
    if (state === "on delivery") {
      orderUpdate.order_on_delivery = new Date();
    } else if (state === "shipped") {
      orderUpdate.order_shipped = new Date();
    } else if (state === "cancelled") {
      orderUpdate.order_cancel = new Date();
    }
    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      orderUpdate,
      { new: true }
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const allOrders = await orderModel.find().sort({ updatedAt: -1 });
    res.status(200).json({
      message: "Order updated successfully",
      order: allOrders,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const confirmReturnOrder = async (req, res) => {
  try {
    const { orderId, stateOrder } = req.body;

    const order = await orderModel
      .findById(orderId)
      .populate("user_id")
      .populate("item.foodId");
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.payment_method === "code") {
      return await orderModel.findByIdAndUpdate(
        orderId,
        {
          order_cancel: new Date(),
          state: "cancelled",
        },
        {
          new: true,
        }
      );
    }
    if(order.payment_gateAway !== "stripe"){
      return await orderModel.findByIdAndUpdate(
        orderId,
        {
          order_return: new Date(),
          state: "returned",
          refund_amount:order.total_price,
        },
        {
          new: true,
        }
      );
    }
    if (!order.payment_intent) {
      return res
        .status(400)
        .json({ message: "Đơn hàng chưa thanh toán qua Stripe" });
    }
    if (stateOrder === "returned" || stateOrder === "cancel") {
      const refund = await stripe.refunds.create({
        payment_intent: order.payment_intent,
      });

      order.state = stateOrder;
      order.refund_id = refund.id;
      order.order_return = new Date();
      await order.save();

      return res
        .status(200)
        .json({ success: true, message: "Hoàn tiền thành công", order });
    } else {
      order.state = "shipped";
      order.order_return = new Date();
      await order.save();
      if (order?.user_id?.email) {
        sendOrderEmail(order.user_id.email, order, "refused");
      }
      return res.status(200).json({
        success: true,
        message: "Từ chối hoàn tiền thành công",
        order,
      });
    }
  } catch (error) {
    console.error("Stripe refund error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Hoàn tiền thất bại" });
  }
};
const searchOrder = async (req, res) => {
  try {
    const search = req.query.search?.trim().toLowerCase();

    if (!search) {
      return res
        .status(400)
        .json({ success: false, message: "Missing search keyword" });
    }

    const allOrders = await orderModel.find().populate("item.foodId");

    const filteredOrders = allOrders
      .filter(
        (order) =>
          order.tracking_id?.toLowerCase().includes(search) ||
          order.address?.phone?.toLowerCase().includes(search) ||
          order.item.some((item) =>
            item.foodId?.name?.toLowerCase().includes(search)
          )
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filteredOrders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No order found" });
    }

    return res.status(200).json({ success: true, data: filteredOrders });
  } catch (error) {
    console.error("Error searching order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const detailOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "no orderId" });
    }
    const order = await orderModel
      .findById(orderId)
      .populate("item.foodId")
      .populate("user_id");
    if (!order) {
      return res.status(404).json({ success: false, message: "no find order" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, errors: error });
  }
};

export {
  getOrder,
  addOrder,
  getListAdminOrder,
  confirmOrder,
  searchOrder,
  detailOrder,
  confirmReturnOrder,
};
