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
      .populate("items.foodId")
      .populate("address")
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

    const { discount_code, delivery_fee, address, payment_method, item } =
      req.body;

    // Tính tổng tiền
    let total_price = item.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    const discount = isNaN(discount_code) ? 0 : discount_code; // Đảm bảo discount_code là số
    const delivery = isNaN(delivery_fee) ? 0 : delivery_fee; // Đảm bảo delivery_fee là số

    total_price = total_price - (total_price * discount) / 100 + delivery;

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

    // Lưu đơn hàng vào database
    const order = new orderModel({
      user_id: req.userId,
      discount_code,
      total_price,
      items,
      delivery_fee,
      address,
      payment_status,
      payment_method,
      payment_id,
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
      .populate("items.foodId", "name price image");

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
    if (!orderId || !state) {
      return res.state(404).json({ success: false, message: "no found" });
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { state },
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
      .populate("items.foodId");

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
      .populate("items.foodId")
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
