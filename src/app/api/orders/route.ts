import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/libs/db/mongodb";
import { Order } from "@/models/orderModel";

export async function POST(req: Request) {
  try {
    await connectDB();

    console.log("Received order request");

    const body = await req.json();
    console.log("Order Request Body:", body);


    const { user, orderNumber, products, totalPrice, paid } = body;

    if (!user) {
        console.error("User is undefined in the request.");
        return NextResponse.json({ error: "User ID is missing"}, {status: 400 });
      }

    if (!orderNumber || !products || !totalPrice) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.create({
      user,
      orderNumber,
      products,
      totalPrice,
      paid,
    });

    console.log("order saved successfully:", order);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order saving error:", error);
    return NextResponse.json(
      { error: "Could not save order" },
      { status: 500 }
    );
  }
}

// export async function GET(req: Request) {
//     const session = (await getServerSession(authOptions)) as Session;

//     if (!session || !session.user?.id) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//       }

//       const userId = session.user.id;

//     try {
//         const user = await User.findById(userId);

//         if (!user || user.orders.length === 0) {
//             return NextResponse.json({ message: 'No orders found.' }, { status: 404 });
//           }

//           return NextResponse.json({ orders: user.orders });
//     } catch(error) {

//         console.error(error);
//         return NextResponse.json({ message: 'Error fetching orders'}, { status: 500 })
//     }

// }
