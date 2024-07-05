import express from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import { addToCart, clearCart, getCart, removeFromCart, updateAmount } from "../controllers/cartController.js";
const cartRouter = express.Router();

cartRouter.post("/add", verifyToken, addToCart);
cartRouter.get("/get", verifyToken, getCart);
cartRouter.post("/remove", verifyToken, removeFromCart);
cartRouter.post("/updateAmount", verifyToken, updateAmount);
cartRouter.get("/clear", verifyToken, clearCart);

export default cartRouter;

