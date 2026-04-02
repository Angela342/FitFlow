"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          FitFlow
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/workouts" className="text-sm text-gray-600 hover:text-gray-900">
            Workouts
          </Link>
          <Link href="/nutrition" className="text-sm text-gray-600 hover:text-gray-900">
            Nutrition
          </Link>
        </div>
      </div>
    </nav>
  );
}
