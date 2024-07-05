import express from "express";
import { addProduct, updateProduct, getProduct, getProducts } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.post("/update/:id", updateProduct);
productRouter.get("/get/:id", getProduct);
productRouter.get("/get", getProducts);

export default productRouter;

