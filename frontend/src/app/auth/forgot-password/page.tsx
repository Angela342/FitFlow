"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      router.push(
        `/auth/verify?email=${encodeURIComponent(email)}&purpose=reset`
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Please try again.";
      setError(msg);
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
          background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)",
        }}
      >
        <span className="text-2xl font-semibold tracking-tight text-rose-400">FitFlow</span>
        <div className="space-y-4">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#fce7f0" }}
          >
            <KeyRound size={28} style={{ color: "#D4698A" }} strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Forgot your
            <br />
            <span className="font-semibold text-rose-400">password?</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            No worries — enter your email and we'll send you a reset code.
          </p>
        </div>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FitFlow. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center">
            <span className="text-2xl font-semibold tracking-tight text-rose-400">FitFlow</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Reset password</h2>
            <p className="text-sm text-gray-500">
              Enter your account email and we&apos;ll send a 6-digit code.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
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
              {loading ? "Sending…" : "Send reset code"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-medium text-rose-400 hover:text-rose-500 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
