import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_SECRET_URI).then(() => console.log("DB Connected"));
};

