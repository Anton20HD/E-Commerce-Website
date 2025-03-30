import { NextResponse } from "next/server";
import { User } from "@/models/userModel";
import connectDB from "@/libs/db/mongodb";


//TODO: Synka frontend/backend regex för namn.
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      return NextResponse.json(
        { message: "Name can only contain letters and spaces" },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Password must include uppercase, lowercase, number, and special character, and be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { code: "USER_EXIST", message: "User already exists" },
        { status: 400 }
      );
    }

    //Hash password before saving to db

    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
