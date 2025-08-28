import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // ✅ clear cookie
  response.cookies.set("userId", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // immediately expire
  });

  return response;
}
