import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in env");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to Mongodb");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Successfully connected to DB!");
  } catch (error) {
    console.error("Mongodb connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

connectDB();
