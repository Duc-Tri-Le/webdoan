import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import { getOrder, addOrder, getListAdminOrder, confirmOrder, searchOrder } from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.get("/list-order",authMiddleware, getOrder)
orderRouter.post("/add-order",authMiddleware, addOrder)
// orderRouter.delete("/remove-order/:id", removeOrder)
orderRouter.get("/list-admin-order",getListAdminOrder)
orderRouter.patch("/update-order",confirmOrder)
orderRouter.get("/search-order", searchOrder)
export default orderRouter