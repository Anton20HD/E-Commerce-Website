import { NextResponse } from "next/server";
import { User } from "@/models/userModel"
import { CartItem } from "@/app/components/cartContext/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions"; 
import connectDB from "@/libs/db/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Request Body:", body);
        const { cartItems } = body;

        const session = await getServerSession(authOptions);
        console.log("Session:", session); 

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized. Please login" },
                { status: 401 }
            );
        }

        const userId = session.user?.id;
        if (!userId) {
            return NextResponse.json(
                { message: "Missing userId in session" },
                { status: 400 }
            );
        }

        if (!cartItems || !Array.isArray(cartItems)) {
            return NextResponse.json(
                { message: "Missing cartItems" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        cartItems.forEach((localItem: CartItem) => {
            const existingItem = user.cartData.find(
                (dbItem: CartItem) =>
                    dbItem._id.toString() === localItem._id.toString() && dbItem.size === localItem.size
            );

            if (existingItem) {
                existingItem.quantity = Math.max(1, existingItem.quantity + localItem.quantity);
            } else {
                user.cartData.push({ ...localItem, quantity: Math.max(1, localItem.quantity) });
            }
        });

        user.markModified("cartData");
        await user.save();

        return NextResponse.json({ message: "Cart updated", cart: user.cartData });
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json({ message: "Error updating cart" }, { status: 500 });
    }
}

export async function GET() {
    try {

        const session = await getServerSession(authOptions);

        if(!session) {
            return NextResponse.json(
                { message: "Unauthorized. Please login"},
                { status: 401 }
            )
        }

        const userEmail = session.user?.email;

        if(!userEmail) {
            return NextResponse.json(
                {message: "Invalid session. User email not found"},
                { status: 400 }
            )
        }

        const user = await User.findOne({ email: userEmail});

        if (!user) {
            return NextResponse.json(
                {message: "User not found"},
                { status: 404}
            );
        }

        return NextResponse.json({ cart: user.cartData})
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { message: "Error fetching cart"},
            { status: 500}
        )
    }
}

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { userId } = await req.json();

    // Clear the cart by setting the cart array to an empty array
    await User.findByIdAndUpdate(userId, { $set: { cartData: [] } });

    return NextResponse.json(
      { message: "Cart cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { message: "Error clearing cart", error },
      { status: 500 }
    );
  }
}