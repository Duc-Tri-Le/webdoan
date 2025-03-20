import configRouter from "../config/router.js";
import Home from "../Pages/Home/home.js";
import Cart from "../Pages/Cart/Cart.js";
import PlaceOder from "../Pages/PlaceOder/PLaceOrder.js";
import User from "../Pages/User/User.js";
import OrderManage from "../Pages/Order_Manage/OrderManage.js";
import DetailFood from "../Pages/DetailFood/DetailFood.js";

const publicRoutes = [
  { path: configRouter.home, component: Home },
  { path: configRouter.cart, component: Cart },
  { path: configRouter.user, component: User },
  { path: configRouter.placeOder, component: PlaceOder },
  { path: configRouter.orderManage, component: OrderManage },
  { path: configRouter.detailFood, component: DetailFood },
];

export { publicRoutes };
