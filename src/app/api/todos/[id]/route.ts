import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyUser } from "@/lib/auth";
import Todo from "@/models/Todo";

// ✅ PATCH update todo
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await verifyUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const { title, content, completed } = await req.json();

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: user._id },
      { title, content, completed },
      { new: true }
    );

    if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ todo: todo.toObject() }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await verifyUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deletedTodo = await Todo.findOneAndDelete({ _id: params.id, userId: user._id });
    if (!deletedTodo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted", todo: deletedTodo.toObject() }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}