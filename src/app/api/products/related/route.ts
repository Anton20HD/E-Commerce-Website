
import productModel from "@/models/productModel";
import connectDB from "@/libs/db/mongodb";
import { NextResponse } from "next/server";

// Better to use request if you are working with app router
export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const subCategory = url.searchParams.get("subCategory");
  const excludeId = url.searchParams.get("excludeId");

  try {
    const relatedProducts = await productModel
      .find({
        category: category || undefined,
        subCategory: subCategory || undefined,
        _id: { $ne: excludeId || undefined }
      })
      .limit(4);

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { message: "Failed to fetch related products " },
      { status: 500 }
    );
  }
}
