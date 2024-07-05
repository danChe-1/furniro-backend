import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;
    cartData[req.body.itemId + "/" + req.body.color + "/" + req.body.size] = {
      id: req.body.itemId,
      color: req.body.color,
      size: req.body.size,
      amount: req.body.amount,
    };
    await userModel.findByIdAndUpdate(req.user.id, {
      cartData,
    });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;
    delete cartData[req.body.itemId];
    await userModel.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
const updateAmount = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;
    if (cartData) {
      cartData[req.body.itemId].amount = req.body.newAmount;
      await userModel.findByIdAndUpdate(req.user.id, { cartData });
    } else {
      throw Error;
    }
    res.json({ success: true, message: "Amount updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
const clearCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart, updateAmount, clearCart };

