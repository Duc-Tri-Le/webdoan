import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import { getOrder, addOrder, getListAdminOrder, confirmOrder, searchOrder, detailOrder, confirmReturnOrder } from "../controllers/orderController.js"

const orderRouter = express.Router()

//user
orderRouter.get("/list-order",authMiddleware, getOrder)
orderRouter.post("/add-order",authMiddleware, addOrder)
// orderRouter.delete("/remove-order/:id", removeOrder)
//staff
orderRouter.get("/list-admin-order",getListAdminOrder)
orderRouter.patch("/update-order",confirmOrder)
orderRouter.patch("/return-order", confirmReturnOrder)
//all
orderRouter.get("/search-order", searchOrder)
orderRouter.get("/detail-order/:id", detailOrder)

export default orderRouter