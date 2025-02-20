import mongoose from "mongoose";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          name: { type: String, required: true },  
          price: { type: Number, required: true }, 
          quantity: { type: Number, required: true },
          size: { type: String, required: true },  
          image: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { minimize: false, timestamps: true }
); //Prevents mongoose from removing empty data

userSchema.pre("save", async function (next) { // Middleware that runs before a document is saved to db
if(!this.isModified("password")) return next(); // Checks if the password hasnt been modified and moves on to save
this.password = await bcrypt.hash(this.password, 10);
next();
})

// const userModel = mongoose.models.user || mongoose.model('User', userSchema);


// export default userModel;

export const User = mongoose.models.User || mongoose.model("User", userSchema);
