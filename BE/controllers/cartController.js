import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";

const getCartUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }
    const cartData = await cartModel
      .findOne({ user_id: req.userId })
      .populate("item.foodId");
    res.status(200).json(cartData);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const addCartUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId } = req.body;

    if (!foodId ) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    let cart = await cartModel.findOne({ user_id: userId });

    // Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = new cartModel({ user_id: userId, item: [{ foodId,quantity:1 }]});
    } else {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const itemIndex = cart.item.findIndex((item) => item.foodId.toString() === foodId);
      
      if (itemIndex !== -1) {
        // Nếu có, tăng số lượng
        cart.item[itemIndex].quantity += 1;
      } else {
        // Nếu chưa có, thêm mới
        cart.item.push({ foodId, quantity: 1 });
      }
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "OK", data: cart });
  } catch (error) {
    console.error("Error in addCartUser:", error);
    return res.status(500).json({ success: false, message: error.message || error });
  }
};


const removeCartUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: foodId } = req.params;
    // console.log(foodId);
    if (!foodId) {
      return res
        .status(400)
        .json({ success: false, message: "foodId is required" });
    }

    // Tìm giỏ hàng của user
    let cart = await cartModel.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Tìm vị trí của sản phẩm trong giỏ hàng
    const itemIndex = cart.item.findIndex((item) => item.foodId.toString() === foodId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Nếu số lượng > 1, giảm số lượng
    if (cart.item[itemIndex].quantity > 1) {
      cart.item[itemIndex].quantity -= 1;
    } else {
      // Nếu số lượng = 1, xóa sản phẩm khỏi giỏ hàng
      cart.item.splice(itemIndex, 1);
    }

    await cart.save(); // Lưu thay đổi vào DB

    res.status(200).json({ success: true, message: "Item updated", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { getCartUser, addCartUser, removeCartUser };
