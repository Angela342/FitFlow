"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
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

  return <>{children}</>;
}
