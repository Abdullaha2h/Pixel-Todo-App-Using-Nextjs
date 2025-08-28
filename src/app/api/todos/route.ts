import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyUser } from "@/lib/auth";
import Todo from "@/models/Todo";

// ✅ GET all todos
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await verifyUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const todos = await Todo.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ todos }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ POST create todo
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await verifyUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const todo = await Todo.create({
      title,
      content: content || "",
      completed: false,
      userId: user._id,
    });

    return NextResponse.json({ todo }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
