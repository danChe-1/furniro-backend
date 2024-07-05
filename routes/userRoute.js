import express from "express";
import {
  addLiked,
  checkIfLiked,
  getLiked,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/signin", loginUser);
userRouter.get("/signout", logoutUser);
userRouter.get("/getDetails", verifyToken, getUserDetails);
userRouter.post("/update", verifyToken, updateUser);
userRouter.get("/get-liked", verifyToken, getLiked);
userRouter.post("/add-liked", verifyToken, addLiked);
userRouter.get("/check-liked", verifyToken, checkIfLiked);
export default userRouter;

