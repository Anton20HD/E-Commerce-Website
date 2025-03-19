/* 
import connectDB from "@/libs/db/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { User } from "@/models/userModel";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    await connectDB();


    const sig = req.headers.get("stripe-signature");
    const body = await req.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    } catch (err: any) {
        console.error("Webhook signature error", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}`}, { status: 400 });
    }

    if(event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userEmail = session.customer_email;

        try {
            if (userEmail) {
                const user = await User.findOne({ email: userEmail});

                if(user) {
                    const cartItems = JSON.parse(session.metadata?.cart || "[]");

                    const newOrder = {
                        orderId: session.id,
                        items: cartItems.map((item: any) => ({
                            productId: item._id,
                            quantity: item.quantity,
                        })),
                        totalAmount: session.amount_total! / 100,
                        date: new Date(),
                        };

                        user.orders.push(newOrder);
                        await user.save();
                    } else {
                        console.warn("User not found with email:", userEmail);
                    }
                } else {
                    console.warn("Guest checkout - No email available")
                }
            }  catch (error) {
                console.error("Error saving order", error);
                return NextResponse.json({ error: "Error saving order" }, { status: 500 }); 
            }
            
        }

        return NextResponse.json({ received: true}, { status: 200});

    }


*/