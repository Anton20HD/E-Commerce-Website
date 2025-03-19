import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions"; 
import connectDB from "@/libs/db/mongodb";
import { Order } from "@/models/orderModel";

export async function POST(req: Request) {
  try {
    await connectDB();

    console.log("Received order request");

    const body = await req.json();
    console.log("Order Request Body:", body);

    const { orderNumber, user, products, totalPrice, paid } = body;

    if (!user) {
      console.error("User is undefined in the request.");
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    if (!orderNumber || !products || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingOrder = await Order.findOne({ orderNumber });

    if (existingOrder) {
      console.log("Order already exists");
      return NextResponse.json(
        { error: "Order already exists" },
        { status: 200 }
      );
    }

    const newOrder = new Order({
      user,
      orderNumber,
      products,
      totalPrice,
      paid,
    });

    await newOrder.save();

    console.log("order saved successfully:", newOrder);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order saving error:", error);
    return NextResponse.json(
      { error: "Could not save order" },
      { status: 500 }
    );
  }
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const userId = session.user.id;

    try {

        await connectDB();

        const orders  = await Order.find({user: userId});

        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: 'No orders found.' }, { status: 404 });
          }

          const ordersWithTimestamp = orders.map(order => ({
            ...order.toObject(),
            createdAt: order.createdAt.toISOString(), // Convert to a readable format
        }));

          return NextResponse.json({ orders: ordersWithTimestamp });
    } catch(error) {

        console.error(error);
        return NextResponse.json({ message: 'Error fetching orders'}, { status: 500 })
    }

}
