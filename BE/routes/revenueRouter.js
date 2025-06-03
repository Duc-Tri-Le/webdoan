import express from "express"
import { revenueTime } from "../controllers/revenueController.js"
const revenueRouter = express.Router()

revenueRouter.get("/time", revenueTime)
export default revenueRouter