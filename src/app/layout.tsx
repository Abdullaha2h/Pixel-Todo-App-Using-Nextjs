import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixel TODOs",
  description: "MERN stack todo app with Next.js + shadcn"


};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <main className="max-w-5xl mx-auto p-4"><Navbar/>{children}</main>
      </body>
    </html>
  );
}
