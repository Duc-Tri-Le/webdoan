import express from "express"
import { authMiddleware } from "../middleware/auth.js"
import { getCartUser, addCartUser, removeCartUser } from "../controllers/cartController.js"
const cartRouter = express.Router()

cartRouter.use(authMiddleware)

//user
cartRouter.get("/list-cart",getCartUser)
cartRouter.post("/add-cart",addCartUser)
cartRouter.delete("/remove-cart/:id",removeCartUser)

export default cartRouter