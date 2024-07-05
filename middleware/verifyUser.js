import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.json({ success: false, message: "You are not logged in, please sign in to your account" });

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.json({ success: false, message: "Error verifying user" });

      req.user = user;
      next();
    });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

