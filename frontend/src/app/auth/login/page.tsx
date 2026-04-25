"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// Read ?from= without useSearchParams (avoids Suspense/hydration issues in Next.js 14)
function getFromParam(): string {
  if (typeof window === "undefined") return "/";
  return new URLSearchParams(window.location.search).get("from") ?? "/";
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect-if-already-authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        const from = getFromParam();
        router.replace(user.role === "Admin" ? (from === "/" ? "/dashboard" : from) : from);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth(
        {
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: new Date().toISOString(),
        },
        data.token
      );
      const from = getFromParam();
      router.push(from !== "/" ? from : data.role === "Admin" ? "/dashboard" : "/");
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: { message?: string; requiresVerification?: boolean; email?: string } } })?.response?.data;
      // If account exists but email not yet verified — send them to the verify page
      if (errData?.requiresVerification && errData?.email) {
        router.push(`/auth/verify?email=${encodeURIComponent(errData.email)}&purpose=register`);
        return;
      }
      const message = errData?.message ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)",
        }}
      >
        <span className="text-2xl font-semibold tracking-tight text-rose-400">
          FitFlow
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Your studio,
            <br />
            <span className="font-semibold text-rose-400">
              beautifully managed.
            </span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            Booking, scheduling, and client management — all in one calm,
            minimal space.
          </p>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} FitFlow. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center">
            <span className="text-2xl font-semibold tracking-tight text-rose-400">
              FitFlow
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{
                background: loading
                  ? "#f9a8d4"
                  : "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="space-y-3 text-center">
            <Link
              href="/auth/forgot-password"
              className="block text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-rose-400 hover:text-rose-500 transition"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

