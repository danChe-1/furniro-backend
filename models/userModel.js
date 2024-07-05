import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    liked: { type: Array, default: [] },
  },
  { minimize: false }
);
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;

