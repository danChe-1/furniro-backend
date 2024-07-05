import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: "https://danche-1.github.io/" }));
app.listen(3000, () => {
  console.log("Port 3000");
});
connectDb();

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

