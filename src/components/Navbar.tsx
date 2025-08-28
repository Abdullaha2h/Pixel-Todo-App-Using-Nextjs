"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ mobile menu toggle
  const router = useRouter();
  const pathname = usePathname();

  // ✅ check auth on mount or path change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [pathname]);

  // ✅ logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const links = !isAuthenticated
    ? [
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Signup" },
      ]
    : [
        { href: "/profile", label: "Profile" },
        { href: "/logout", label: "Logout", onClick: handleLogout },
      ];

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 mx-6 mt-4 shadow relative">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          PIXEL TODOs
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-4">
          {links.map((link) =>
            link.href === "/logout" ? (
              <Button
                key={link.label}
                variant="destructive"
                onClick={link.onClick}
              >
                {link.label}
              </Button>
            ) : (
              <Link key={link.href} href={link.href}>
                <Button variant={link.href === "/login" ? "outline" : "default"}>
                  {link.label}
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-4 md:hidden">
          {links.map((link) =>
            link.href === "/logout" ? (
              <Button
                key={link.label}
                variant="destructive"
                onClick={() => {
                  link.onClick?.();
                  setMenuOpen(false);
                }}
                className="w-full"
              >
                {link.label}
              </Button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                <Button
                  variant={link.href === "/login" ? "outline" : "default"}
                  className="w-full"
                >
                  {link.label}
                </Button>
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
