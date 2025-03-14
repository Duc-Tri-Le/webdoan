import Add from "../pages/Add/Add.jsx";
import DeliveryManagement from "../pages/DeliveryManagement/DeliveryManagement.jsx";
import List from "../pages/List/List.jsx";
import OrderManagement from "../pages/OrderManagement/OrderManagement.jsx";
import ReturnManagement from "../pages/ReturnManagement/ReturnManagement.jsx";
import SaleStatistics from "../pages/SalesStatistics/SaleStatistics.jsx";
import Update from "../pages/Update/Update.jsx";

const ConfigRoutes = {
  add: "/",
  list: "/list-item",
  update: "/update/:id",
  order_management: "/management",
  return_management: "/return_management",
  delivery_management: "/delivery_management",
  sales_statistics: "/statistics",
};

const PrivateRouter = [
  { path: ConfigRoutes.add, component: Add },
  { path: ConfigRoutes.list, component: List },
  { path: ConfigRoutes.update, component: Update },
  { path: ConfigRoutes.order_management, component: OrderManagement },
  { path: ConfigRoutes.return_management, component: ReturnManagement },
  { path: ConfigRoutes.delivery_management, component: DeliveryManagement },
  { path: ConfigRoutes.sales_statistics, component: SaleStatistics },
];

export { PrivateRouter, ConfigRoutes };
