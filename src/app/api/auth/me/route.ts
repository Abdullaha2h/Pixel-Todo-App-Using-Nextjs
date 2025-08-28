import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/auth";

export async function GET() {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
}
