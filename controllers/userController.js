import userModel from "../models/userModel.js";
import { errorHandler } from "../middleware/error.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return next(errorHandler(409, "This email is already registered!"));
    }

    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Invalid Email"));
    }
    if (!validator.isStrongPassword(password)) {
      return next(errorHandler(400, "Choose a stronger password - Uppercase, lowecase, numbers and special symbols"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Credentials are incorrect" });
    }
    const token = createToken(user._id);
    res
      .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
      .json({ success: true, data: token });
  } catch (error) {
    next(error);
  }
};
const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    next(error);
  }
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const getUserDetails = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await userModel.findById(id);
    if (!user) return next(errorHandler(404, "No User Found"));
    const { password: pass, ...rest } = user._doc;
    res.json({ success: true, data: rest });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const id = req.user.id;

    if (req.body.password) {
      if (!validator.isStrongPassword(req.body.password)) {
        return res.json({ success: false, message: "Choose a stronger password" });
      }

      req.body.password = await bcrypt.hashSync(req.body.password, 10);
    }

    const updateUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.json({ success: true, data: rest });
  } catch (error) {
    next(error);
  }
};

const addLiked = async (req, res) => {
  try {
    const { product } = req.body;
    let userData = await userModel.findById(req.user.id);
    let liked = await userData.liked;
    liked.push(product);
    await userModel.findByIdAndUpdate(req.user.id, { liked });
    res.json({ success: true, message: "Added to liked" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
const getLiked = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let liked = await userData.liked;
    res.json({ success: true, liked });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
const checkIfLiked = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let liked = await userData.liked;
    console.log(liked);
    const isLiked = await liked.find((x) => x._id === req.query.productId);
    if (!isLiked) return res.json({ success: true, data: false });
    return res.json({ success: true, data: true });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
const removeFromLiked = async (req, res) => {
  try {
    //todo
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};
export { registerUser, loginUser, getUserDetails, logoutUser, updateUser, addLiked, getLiked, checkIfLiked, removeFromLiked };

