import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    short_description: { type: String, required: true },
    sizes: { type: Array, required: true },
    colors: { type: Array, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    images: { type: Array, required: true },
    full_description: { type: String, required: true },
    discount: { type: Number, required: true },
    isNewProduct: { type: Boolean, required: true, default: true },
    material: { type: Array, required: true },
    collectionName: { type: String, required: true },
  },
  { timestamps: true }
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;

