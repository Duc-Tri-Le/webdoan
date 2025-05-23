import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import handelWebHook from "./payment/stripe/webhook.js";
import handelWebHookMoMo from "./payment/momo/webhookMomo.js";
import bodyParser from "body-parser";
import dotenv from "dotenv"
//app

const app = express();
const port = 4000;
//webhook
//api webhook cho stripe
app.post(
  "/api/webhookStripe",
  bodyParser.raw({ type: "application/json" }),
  handelWebHook
);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Db
connectDB();

//dotenv
dotenv.config()
//api 
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
//api webhook momo
app.post("/api/webhookMoMo", handelWebHookMoMo);

app.get("/", (req, res) => {
  res.send("APT Working");
});

app.listen(port, () => {
  console.log(`Server is starting on http://localhost:${port}`);
});
