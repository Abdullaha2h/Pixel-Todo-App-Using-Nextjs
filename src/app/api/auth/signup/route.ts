import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // create user
    const newUser = await User.create({ name, email, password });

    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
