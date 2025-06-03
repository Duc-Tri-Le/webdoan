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
import CreateStaff from "../pages/CreateStaff/CreateStaff.jsx";
import GrantRole from "../pages/GrantRole/GrantRole.jsx";
import ListStaff from "../pages/ListStaff/ListStaff.jsx";
import ProductRecommendation from "../pages/ProductRecommendation/ProductRecommendation.jsx";
import ChatBox from "../components/ChatBox/ChatBox.jsx";
import WaitingManagement from "../pages/WaitingManagement/WaitingManagement.jsx";
import ProcessManagement from "../pages/ProcessManagement/ProcessManagement.jsx";

const ConfigRoutes = {
  add: "/",
  list: "/list-item",
  update: "/update/:id",
  order_management: "/management",
  return_management: "/return_management",
  delivery_management: "/delivery_management",
  sales_statistics: "/statistics",
  cancel_management: "/cancel_management",
  process_management: "/process_management",
  waiting_management: "/waiting_management",
  shipped_management: "/shipped_management",
  detail_order: "/detail_order/:id",
  create_staff: "/create_staff",
  list_staff: "/list_staff",
  grant_role_staff: "/grant_role_staff",
  product_recommendation: "/product_recommendation",
  chatBox: "/chatBox",
};

const PrivateRouter = [
  { path: ConfigRoutes.add, component: Add },
  { path: ConfigRoutes.list, component: List },
  { path: ConfigRoutes.update, component: Update },
  { path: ConfigRoutes.order_management, component: OrderManagement },
  { path: ConfigRoutes.delivery_management, component: DeliveryManagement },
  { path: ConfigRoutes.return_management, component: ReturnManagement },
  { path: ConfigRoutes.sales_statistics, component: SaleStatistics },
  { path: ConfigRoutes.process_management, component: ProcessManagement },
  { path: ConfigRoutes.waiting_management, component: WaitingManagement },
  { path: ConfigRoutes.cancel_management, component: CancelManagement },
  { path: ConfigRoutes.shipped_management, component: ShippedManagement },
  { path: ConfigRoutes.detail_order, component: DetailOrder },
  { path: ConfigRoutes.create_staff, component: CreateStaff },
  { path: ConfigRoutes.grant_role_staff, component: GrantRole },
  { path: ConfigRoutes.list_staff, component: ListStaff },
  {
    path: ConfigRoutes.product_recommendation,
    component: ProductRecommendation,
  },
  { path: ConfigRoutes.chatBox, component: ChatBox },
];

export { PrivateRouter, ConfigRoutes };
