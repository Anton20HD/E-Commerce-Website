import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in env");
}


//Dont forget to change to env variable later
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://antonhaglund20:zFSZKv9LEEpqV2BZ@ecommerce.xlt8q.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Ecommerce"
    );
    //console.log("Successfully connected to DB!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;

connectDB();
