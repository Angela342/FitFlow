"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, hydrateFromStorage } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setChecked(true);
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      router.replace(`/auth/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [checked, isAuthenticated, router, pathname]);

  // Still hydrating
  if (!checked || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#fb7185", borderRightColor: "#c084fc" }}
          />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  // Authenticated but not an admin
  if (user?.role !== "Admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "linear-gradient(135deg, #fce4ec, #f3e5f5)" }}
        >
          <ShieldOff size={24} className="text-rose-400" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold text-gray-800">Access denied</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            This page is only available to studio admins. If you believe this is
            a mistake, please contact your studio owner.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white"
          style={{
            background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
          }}
        >
          Go home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
