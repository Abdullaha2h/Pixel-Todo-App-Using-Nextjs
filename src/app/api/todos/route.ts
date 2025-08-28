import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyUser } from "@/lib/auth";
import Todo from "@/models/Todo";

// ✅ GET all todos
export async function GET() {
  try {
    await connectDB();
    const user = await verifyUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const todos = await Todo.find({ userId: user._id }).sort({ createdAt: -1 });
    // ✅ convert Mongoose docs to plain objects
    const plainTodos = todos.map((t) => t.toObject());

    return NextResponse.json({ todos: plainTodos }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ POST create todo
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await verifyUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, content } = body;
    
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    // ✅ Create todo with proper content handling
    const todo = await Todo.create({
      title,
      content: content || "", // Ensure content is always defined
      completed: false,
      userId: user._id,
    });

    return NextResponse.json({ todo: todo.toObject() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}