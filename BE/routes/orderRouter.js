import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import { getOrder, addOrder, removeOrder, getListAdminOrder } from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.get("/list-order",authMiddleware, getOrder)
orderRouter.post("/add-order",authMiddleware, addOrder)
orderRouter.delete("/remove-order",authMiddleware, removeOrder)
orderRouter.get("/list-admin-order",getListAdminOrder)

export default orderRouter