import configRouter from "../config/router.js";
import Home from "../Pages/Home/home.js";
import Cart from "../Pages/Cart/Cart.js";
import PlaceOder from "../Pages/PlaceOder/PLaceOrder.js";
import ManagementUser from "../Pages/ManagementUSer/ManagementUser.js";
import DetailFood from "../Pages/DetailFood/DetailFood.js";
import Bill from "../Pages/Bill/Bill.js";
import CompletePayment from "../Pages/Notification/completePayment.js";

const publicRoutes = [
  { path: configRouter.home, component: Home },
  { path: configRouter.cart, component: Cart },
  { path: configRouter.managementUser, component: ManagementUser },
  { path: configRouter.placeOder, component: PlaceOder },
  // { path: configRouter.orderManage, component: OrderManage },
  { path: configRouter.detailFood, component: DetailFood },
  { path: configRouter.bill, component: Bill },
  { path: configRouter.completePayment, component: CompletePayment },
];

export { publicRoutes };
