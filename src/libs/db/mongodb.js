import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in env");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
   // console.log("Successfully connected to DB!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;

connectDB();
