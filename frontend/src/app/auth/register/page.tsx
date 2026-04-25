"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// ── Password strength ─────────────────────────────────────────────────────────

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

interface StrengthResult {
  level: StrengthLevel;
  score: number; // 0-4
  label: string;
  color: string;
  barColor: string;
  feedback: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password) {
    return { level: "empty", score: 0, label: "", color: "", barColor: "", feedback: "" };
  }

  let score = 0;
  const missing: string[] = [];

  if (password.length >= 8) score++;
  else missing.push("at least 8 characters");

  if (/[A-Z]/.test(password)) score++;
  else missing.push("an uppercase letter");

  if (/[0-9]/.test(password)) score++;
  else missing.push("a number");

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else missing.push("a special character");

  const map: Record<number, Omit<StrengthResult, "score" | "feedback">> = {
    0: { level: "weak",   label: "Too weak",  color: "text-rose-500",   barColor: "bg-rose-400"   },
    1: { level: "weak",   label: "Weak",      color: "text-rose-500",   barColor: "bg-rose-400"   },
    2: { level: "fair",   label: "Fair",      color: "text-amber-500",  barColor: "bg-amber-400"  },
    3: { level: "good",   label: "Good",      color: "text-lime-600",   barColor: "bg-lime-400"   },
    4: { level: "strong", label: "Strong",    color: "text-emerald-600", barColor: "bg-emerald-400" },
  };

  const { level, label, color, barColor } = map[score];
  const feedback =
    score < 4 && missing.length
      ? `Add ${missing.slice(0, 2).join(" and ")} to strengthen your password.`
      : "";

  return { level, score, label, color, barColor, feedback };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  useAuthStore(); // keep store available for redirect-if-authenticated check

  // Redirect-if-already-authenticated: runs once on mount only
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        router.replace(user.role === "Admin" ? "/dashboard" : "/");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount only

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.confirmPassword !== form.password;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (strength.score < 3) {
      setError("Please choose a stronger password before continuing.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });

      // Registration now requires email verification before issuing a token
      router.push(
        `/auth/verify?email=${encodeURIComponent(data.email)}&purpose=register`
      );
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #fce4ec 100%)",
        }}
      >
        <div>
          <span className="text-2xl font-semibold tracking-tight text-violet-400">
            FitFlow
          </span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Join the community
            <br />
            <span className="font-semibold text-violet-400">
              built for wellness.
            </span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            Create your account and start managing bookings, classes, and
            clients effortlessly.
          </p>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} FitFlow. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <span className="text-2xl font-semibold tracking-tight text-violet-400">
              FitFlow
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create your account
            </h2>
            <p className="text-sm text-gray-500">
              It only takes a moment to get started
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Email */}
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="phone"
              >
                Phone{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Password */}
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
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
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

              {/* Strength meter */}
              {form.password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          strength.score >= seg
                            ? strength.barColor
                            : "bg-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-medium transition-colors ${strength.color}`}
                    >
                      {strength.label}
                    </p>
                    {strength.feedback && (
                      <p className="text-xs text-gray-400 text-right max-w-[200px]">
                        {strength.feedback}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 ${
                    passwordsMismatch
                      ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                      : "border-gray-200 focus:border-violet-300 focus:ring-violet-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-xs text-rose-500">Passwords don&apos;t match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || passwordsMismatch}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{
                background:
                  loading || passwordsMismatch
                    ? "#c4b5fd"
                    : "linear-gradient(135deg, #a78bfa 0%, #fb7185 100%)",
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-violet-400 hover:text-violet-500 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
