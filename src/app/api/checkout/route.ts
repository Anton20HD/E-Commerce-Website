import { metadata } from "@/app/login/layout";
import connectDB from "@/libs/db/mongodb";
import { Order } from "@/models/orderModel";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // await connectDB();

  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { cart, user } = await req.json();

  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: "sek",
      product_data: {
        name: `${item.name} - Size: ${item.size}`,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity || 1,
  }));


  const generateOrderNumber = () => {

    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of the timestamp
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `#${timestamp}${random}`;
  }


  try {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: user?.email || "",
      metadata : {
        cart: JSON.stringify(cart),
        customer_name: user?.name || "Guest",
        order_number: generateOrderNumber(),
      },
      locale: "en",
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Could not create stripe session" },
      { status: 500 }
    );
  }
}
