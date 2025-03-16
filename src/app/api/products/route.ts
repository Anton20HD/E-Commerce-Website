import { NextResponse } from "next/server";
import productModel from "@/models/productModel";
import { User } from "@/models/userModel";
import connectDB from "@/libs/db/mongodb";
import { uploadToCloudinary, CloudinaryResult } from "@/libs/cloud/cloudinary";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const subCategory = formData.get("subCategory") as string;

    const sizesField = formData.get("sizes") as string | null;
    const sizes = sizesField ? sizesField.split(",") : [];
    const soldout = formData.get("soldout") !== undefined;

    // Get the file from form data
    const file = formData.get("image") as Blob;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result: CloudinaryResult = await uploadToCloudinary(
      buffer,
      "products"
    );

    // Create a new product
    const newProduct = new productModel({
      name,
      description,
      price,
      image: [result.url],
      category,
      subCategory,
      sizes: sizes.map((size) => size.trim()),
      soldout: soldout ?? false,
    });

    await newProduct.save();
    return NextResponse.json(
      {
        message: `${
          category.charAt(0).toUpperCase() + category.slice(1)
        } created successfully`,
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error creating product", error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    const query = category ? { category } : {};
    const products = await productModel.find(query);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
