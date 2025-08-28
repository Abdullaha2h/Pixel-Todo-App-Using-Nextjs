import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import User from "@/models/User";

export async function verifyUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null; // ❌ not logged in
  }

  await connectDB();
  const user = await User.findById(userId).select("-password"); // hide password

  return user || null;
}
