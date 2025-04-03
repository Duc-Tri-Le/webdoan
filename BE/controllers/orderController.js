import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
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
    return res.json({ success: true, data: orders });
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

    const { discount_code, delivery_fee, address, payment_method, item, total_price } =
      req.body;

    let payment_id = null;
    let payment_status = false; // Mặc định đơn hàng chưa thanh toán

    // Nếu chọn thanh toán online, tạo phiên Stripe
    if (payment_method === "online") {
      payment_status = true;
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      // const line_item = item.map((item) => ({
      //   price_data: {
      //     currency: "vnd",
      //     product_data: { name: item.name },
      //     unit_amount: item.price * 1000, // Stripe dùng đơn vị nhỏ nhất (VND -> VND*1000)
      //   },
      //   quantity: item.quantity,
      // }));

      // // Thêm phí vận chuyển vào đơn hàng
      // line_item.push({
      //   price_data: {
      //     currency: "vnd",
      //     product_data: { name: "Delivery Fee" },
      //     unit_amount: delivery_fee * 1000,
      //   },
      //   quantity: 1,
      // });

      // const session = await stripe.checkout.sessions.create({
      //   payment_method_types: ["card"],
      //   line_item,
      //   mode: "payment",
      //   success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      //   cancel_rul: `${process.env.FRONTEND_URL}/cancel`,
      // });

      // payment_id = session.id; // Lưu ID giao dịch Stripe
      // payment_status = true; // Xác nhận đơn hàng đã thanh toán
    } else {
      // Nếu là COD, đơn hàng sẽ chờ thanh toán khi giao hàng
      payment_status = false;
    }

    const items = item.map((item) => ({
      foodId: item._id,
      quantity: item.quantity,
    }));

    const order_create = new Date();
    // Lưu đơn hàng vào database
    const order = new orderModel({
      user_id: req.userId,
      discount_code,
      total_price,
      item:items,
      delivery_fee,
      address,
      payment_status,
      payment_method,
      payment_id,
      order_create,
    });

    await order.save();
    await cartModel.findOneAndDelete({ user_id: req.userId });

    return res
      .status(200)
      .json({ success: true, message: "Order created", order, item });
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

    // Kiểm tra nếu không có đơn hàng
    if (!adminOrders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }
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
    } else if (state === "return") {
      orderUpdate.order_return = new Date();
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      orderUpdate,
      { new: true }
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updateOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchOrder = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    if (!search) {
      return res
        .status(400)
        .json({ success: false, message: "No order found" });
    }

    const data = await orderModel
      .find({
        $or: [
          { tracking_id: { $regex: search, $options: "i" } },
          { "address.phone": { $regex: search, $options: "i" } },
        ],
      })
      .populate("item.foodId");

    if (data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No order found" });
    }

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("Error searching order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const detailOrder = async (req, res) => {
  try {
    const tracking_id = req.params.id;
    if (!tracking_id) {
      return res
        .status(400)
        .json({ success: false, message: "no tracking_id" });
    }
    const order = await orderModel
      .findOne({ tracking_id: tracking_id })
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
};
