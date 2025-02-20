
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Nullable for guest orders
      orderNumber: { type: String, required: true, unique: true }, 
      products: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          size: { type: String, required: true },
          image: { type: String, required: true },
        },
      ],
      totalPrice: { type: Number, required: true },
      paid: { type: Boolean, default: false }, // Boolean to track if payment was successful
    },
    { timestamps: true }
  );
  
  export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
  