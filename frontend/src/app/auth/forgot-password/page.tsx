"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      router.push(`/auth/verify?email=${encodeURIComponent(email)}&purpose=reset`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
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
        style={{ background: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #fce4ec 100%)" }}
      >
        <span className="text-2xl font-semibold tracking-tight text-violet-400">FitFlow</span>
        <div className="space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "#ede9fe" }}>
            <Mail size={30} style={{ color: "#8b5cf6" }} strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Reset your<br />
            <span className="font-semibold text-violet-400">password.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            We&apos;ll send a 6-digit code to your email so you can create a new password.
          </p>
        </div>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FitFlow. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center">
            <span className="text-2xl font-semibold tracking-tight text-violet-400">FitFlow</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Forgot your password?</h2>
            <p className="text-sm text-gray-500">
              Enter your email and we&apos;ll send you a reset code.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email address</label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{ background: loading ? "#c4b5fd" : "linear-gradient(135deg, #a78bfa 0%, #fb7185 100%)" }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending…" : "Send reset code"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            <Link href="/auth/login" className="text-rose-400 hover:text-rose-500 transition">← Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
