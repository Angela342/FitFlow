"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/api";

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

interface StrengthResult {
  level: StrengthLevel; score: number; label: string;
  color: string; barColor: string; feedback: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { level: "empty", score: 0, label: "", color: "", barColor: "", feedback: "" };
  let score = 0;
  const missing: string[] = [];
  if (password.length >= 8) score++; else missing.push("at least 8 characters");
  if (/[A-Z]/.test(password)) score++; else missing.push("an uppercase letter");
  if (/[0-9]/.test(password)) score++; else missing.push("a number");
  if (/[^A-Za-z0-9]/.test(password)) score++; else missing.push("a special character");
  const map: Record<number, Omit<StrengthResult, "score" | "feedback">> = {
    0: { level: "weak",   label: "Too weak", color: "text-rose-500",    barColor: "bg-rose-400" },
    1: { level: "weak",   label: "Weak",     color: "text-rose-500",    barColor: "bg-rose-400" },
    2: { level: "fair",   label: "Fair",     color: "text-amber-500",   barColor: "bg-amber-400" },
    3: { level: "good",   label: "Good",     color: "text-lime-600",    barColor: "bg-lime-400" },
    4: { level: "strong", label: "Strong",   color: "text-emerald-600", barColor: "bg-emerald-400" },
  };
  const { level, label, color, barColor } = map[score];
  const feedback = score < 4 && missing.length ? `Add ${missing.slice(0,2).join(" and ")} to strengthen your password.` : "";
  return { level, score, label, color, barColor, feedback };
}

function getParams() {
  if (typeof window === "undefined") return { email: "", code: "" };
  const p = new URLSearchParams(window.location.search);
  return { email: p.get("email") ?? "", code: p.get("code") ?? "" };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength.score < 3) { setError("Please choose a stronger password."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    try {
      const { email, code } = getParams();
      await api.post("/auth/reset-password", { email, code, newPassword: password });
      setDone(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong.";
      setError(msg);
    } finally { setLoading(false); }
  }, [password, confirm, strength, router]);

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="text-center space-y-4">
          <CheckCircle size={48} className="mx-auto text-emerald-400" />
          <h2 className="text-xl font-semibold text-gray-800">Password reset!</h2>
          <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)" }}>
        <span className="text-2xl font-semibold tracking-tight text-rose-400">FitFlow</span>
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Create your<br /><span className="font-semibold text-rose-400">new password.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">Choose something strong and memorable.</p>
        </div>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FitFlow. All rights reserved.</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center">
            <span className="text-2xl font-semibold tracking-tight text-rose-400">FitFlow</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">New password</h2>
            <p className="text-sm text-gray-500">Enter and confirm your new password below.</p>
          </div>

          {error && <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">New password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100" />
                <button type="button" onClick={() => setShowPassword(v=>!v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(seg => (
                      <div key={seg} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= seg ? strength.barColor : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-medium ${strength.color}`}>{strength.label}</p>
                    {strength.feedback && <p className="text-xs text-gray-400 text-right max-w-[200px]">{strength.feedback}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} required value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 ${mismatch ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100" : "border-gray-200 focus:border-rose-300 focus:ring-rose-100"}`} />
                <button type="button" onClick={() => setShowConfirm(v=>!v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mismatch && <p className="text-xs text-rose-500">Passwords don&apos;t match.</p>}
            </div>

            <button type="submit" disabled={loading || mismatch}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{ background: loading || mismatch ? "#f9a8d4" : "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Resetting…" : "Reset password"}
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
