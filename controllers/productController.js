import { errorHandler } from "../middleware/error.js";
import productModel from "../models/productModel.js";

const addProduct = async (req, res, next) => {
  const product = new productModel({
    name: req.body.name,
    price: req.body.price,
    short_description: req.body.short_description,
    sizes: req.body.sizes,
    colors: req.body.colors,
    sku: req.body.sku,
    category: req.body.category,
    images: req.body.images,
    full_description: req.body.full_description,
    discount: req.body.discount,
    isNewProduct: req.body.isNewProduct,
    material: req.body.material,
    collectionName: req.body.collectionName,
  });
  try {
    await product.save();
    res.json({ success: true, message: "Product Added", product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(errorHandler(404, "Product not found!"));
  }
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        short_description: req.body.short_description,
        sizes: req.body.sizes,
        colors: req.body.color,
        sku: req.body.sku,
        category: req.body.category,
        images: req.body.images,
        full_description: req.body.full_description,
        discount: req.body.discount,
        isNewProduct: req.body.isNewProduct,
        material: req.body.material,
        collectionName: req.body.collectionName,
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Product updated", updatedProduct });
  } catch (error) {
    next(error);
  }
};
const getProduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return next(errorHandler(404, "Product not found"));
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const query = {};

    let isNewProduct = req.query.isNewProduct;
    if (isNewProduct === undefined || isNewProduct === "false") {
      query.isNewProduct = { $in: [false, true] };
    } else {
      query.isNewProduct = isNewProduct;
    }

    let discount = req.query.discount;
    if (discount === "true") {
      query.discount = { $gt: 0 };
    }

    let category = req.query.category;
    if (category) {
      query.category = category;
    }
    let collectionName = req.query.collectionName;
    if (collectionName) {
      query.collectionName = collectionName;
    }
    let searchTerm = req.query.searchTerm;
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { collectionName: { $regex: searchTerm, $options: "i" } },
        { short_description: { $regex: searchTerm, $options: "i" } },
        { full_description: { $regex: searchTerm, $options: "i" } },
        { collectionName: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const products = await productModel
      .find(query)
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
export { addProduct, updateProduct, getProduct, getProducts };

