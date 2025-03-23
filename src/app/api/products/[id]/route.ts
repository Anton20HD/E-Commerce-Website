import { NextResponse, NextRequest } from "next/server";
  import productModel from "@/models/productModel";
  import connectDB from "@/libs/db/mongodb";
 
  export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); 
  
    if (!id) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    await connectDB();

    try {
      const product = await productModel.findById(id);
      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { message: "Error fetching product" },
        { status: 500 }
      );
    }
  }
