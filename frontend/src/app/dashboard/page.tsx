"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, CalendarDays, BookOpen } from "lucide-react";
import AdminRoute from "@/components/auth/AdminRoute";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import type { Studio } from "@/types";

export default function DashboardPage() {
  const [studio, setStudio] = useState<Studio | null>(null);

  useEffect(() => {
    api
      .get("/studio")
      .then(({ data }) => setStudio(data))
      .catch(() => setStudio(null));
  }, []);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-gray-800">
                {studio ? studio.name : "Dashboard"}
              </h1>
              <p className="text-sm text-gray-500">
                {studio
                  ? "Here's what's happening at your studio"
                  : "Welcome — set up your studio profile to get started"}
              </p>
            </div>

            <Link
              href="/dashboard/studio"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm transition hover:border-rose-200 hover:text-rose-400"
            >
              <Settings size={15} />
              Studio settings
            </Link>
          </div>

          {/* Setup prompt if no studio yet */}
          {!studio && (
            <div
              className="mt-8 rounded-2xl border border-dashed border-rose-200 p-8 text-center"
              style={{ background: "linear-gradient(135deg, #fff5f5, #fdf4ff)" }}
            >
              <p className="text-sm font-medium text-gray-700">
                Your studio profile isn&apos;t set up yet.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Add your studio name, address, and contact info so clients can
                find you.
              </p>
              <Link
                href="/dashboard/studio"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
                }}
              >
                Set up studio
              </Link>
            </div>
          )}

          {/* Quick links */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              href="/dashboard/classes"
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-rose-200 hover:shadow"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "#fce7f0" }}>
                <BookOpen size={18} style={{ color: "#D4698A" }} />
              </div>
              <span className="text-sm font-medium text-gray-700">Classes</span>
            </Link>
            <Link
              href="/dashboard/schedule"
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "#f0ebff" }}>
                <CalendarDays size={18} style={{ color: "#8b5cf6" }} />
              </div>
              <span className="text-sm font-medium text-gray-700">Schedule</span>
            </Link>
          </div>

          {/* Stat cards */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Bookings", value: "—" },
              { label: "Active Clients", value: "—" },
              { label: "Classes This Week", value: "—" },
              { label: "Revenue", value: "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-light text-gray-700">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
