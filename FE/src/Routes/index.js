import configRouter from "../config/router.js"
import Home from "../Pages/Home/home.js"
import Cart from "../Pages/Cart/Cart.js"
import PlaceOder from "../Pages/PlaceOder/PLaceOrder.js"
import Profile from "../Pages/Profile/profile.js"
import OrderManage from "../Pages/Order_Manage/OrderManage.js"

const publicRoutes = [
    {path : configRouter.home, component:Home},
    {path : configRouter.cart, component:Cart},
    {path : configRouter.profile, component:Profile},
    {path : configRouter.placeOder, component:PlaceOder},
    {path: configRouter.orderManage, component:OrderManage}
]

export {publicRoutes}