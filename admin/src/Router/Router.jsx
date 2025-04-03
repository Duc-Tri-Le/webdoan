import Add from "../pages/Add/Add.jsx";
import DeliveryManagement from "../pages/DeliveryManagement/DeliveryManagement.jsx";
import List from "../pages/List/List.jsx";
import OrderManagement from "../pages/OrderManagement/OrderManagement.jsx";
import ReturnManagement from "../pages/ReturnManagement/ReturnManagement.jsx";
import SaleStatistics from "../pages/SalesStatistics/SaleStatistics.jsx";
import Update from "../pages/Update/Update.jsx";
import CancelManagement from "../pages/CancelManagement/CancelManagement.jsx";
import DetailOrder from "../pages/DetailOrder/DetailOrder.jsx";
import ShippedManagement from "../pages/ShippedManagement/ShippedManagement.jsx";

const ConfigRoutes = {
  add: "/",
  list: "/list-item",
  update: "/update/:id",
  order_management: "/management",
  return_management: "/return_management",
  delivery_management: "/delivery_management",
  sales_statistics: "/statistics",
  cancel_management: "/cancel_management",
  shipped_management: "/shipped_management",
  detail_order: "/detail_order/:id",
};

const PrivateRouter = [
  { path: ConfigRoutes.add, component: Add },
  { path: ConfigRoutes.list, component: List },
  { path: ConfigRoutes.update, component: Update },
  { path: ConfigRoutes.order_management, component: OrderManagement },
  { path: ConfigRoutes.delivery_management, component: DeliveryManagement },
  { path: ConfigRoutes.return_management, component: ReturnManagement },
  { path: ConfigRoutes.sales_statistics, component: SaleStatistics },
  { path: ConfigRoutes.cancel_management, component: CancelManagement },
  { path: ConfigRoutes.shipped_management, component: ShippedManagement },
  { path: ConfigRoutes.detail_order, component: DetailOrder },
];

export { PrivateRouter, ConfigRoutes };
