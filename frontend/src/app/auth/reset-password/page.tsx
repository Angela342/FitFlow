"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/api";

function getParams() {
  if (typeof window === "undefined") return { email: "", code: "" };
  const p = new URLSearchParams(window.location.search);
  return { email: p.get("email") ?? "", code: p.get("code") ?? "" };
}

function getStrengthScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_MAP: Record<number, { label: string; color: string; bar: string }> = {
  0: { label: "Too weak",  color: "text-rose-500",    bar: "bg-rose-400"    },
  1: { label: "Weak",      color: "text-rose-500",    bar: "bg-rose-400"    },
  2: { label: "Fair",      color: "text-amber-500",   bar: "bg-amber-400"   },
  3: { label: "Good",      color: "text-lime-600",    bar: "bg-lime-400"    },
  4: { label: "Strong",    color: "text-emerald-600", bar: "bg-emerald-400" },
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [params, setParams] = useState({ email: "", code: "" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { setParams(getParams()); }, []);

  const strength = useMemo(() => STRENGTH_MAP[getStrengthScore(password)], [password]);
  const score = useMemo(() => getStrengthScore(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score < 3) { setError("Please choose a stronger password."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", {
        email: params.email,
        code: params.code,
        newPassword: password,
      });
      setDone(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "#f0fdf4" }}>
            <CheckCircle size={32} className="text-emerald-500" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Password reset!</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-block w-full rounded-xl py-3 text-sm font-medium text-white transition"
            style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)" }}
      >
        <span className="text-2xl font-semibold tracking-tight text-rose-400">FitFlow</span>
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Create a new
            <br />
            <span className="font-semibold text-rose-400">password.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            Choose something strong that you&apos;ll remember.
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
            <h2 className="text-2xl font-semibold text-gray-800">New password</h2>
            <p className="text-sm text-gray-500">
              Setting a new password for{" "}
              <span className="font-medium text-gray-700">{params.email}</span>
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((seg) => (
                      <div key={seg} className={`h-1 flex-1 rounded-full transition-all duration-300 ${score >= seg ? strength.bar : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.color}`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirm">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 ${
                    mismatch
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-gray-200 focus:border-rose-300 focus:ring-rose-100"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mismatch && <p className="text-xs text-rose-500">Passwords don&apos;t match.</p>}
            </div>

            <button
              type="submit"
              disabled={loading || mismatch}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{
                background: loading || mismatch
                  ? "#f9a8d4"
                  : "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
