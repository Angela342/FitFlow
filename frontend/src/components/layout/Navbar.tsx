"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-rose-400">
          FitFlow
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <>
              {user?.role === "Admin" ? (
                <>
                  <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800 transition">Dashboard</Link>
                  <Link href="/dashboard/classes" className="text-sm text-gray-500 hover:text-gray-800 transition">Classes</Link>
                  <Link href="/dashboard/schedule" className="text-sm text-gray-500 hover:text-gray-800 transition">Schedule</Link>
                </>
              ) : (
                <>
                  <Link href="/classes" className="text-sm text-gray-500 hover:text-gray-800 transition">Classes</Link>
                  <Link href="/workouts" className="text-sm text-gray-500 hover:text-gray-800 transition">Workouts</Link>
                  <Link href="/nutrition" className="text-sm text-gray-500 hover:text-gray-800 transition">Nutrition</Link>
                </>
              )}
            </>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:border-rose-200 hover:text-rose-400 transition">
                <LogOut size={13} /> Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-800 transition">Sign in</Link>
              <Link href="/auth/register" className="rounded-xl px-4 py-2 text-sm font-medium text-white transition"
                style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
