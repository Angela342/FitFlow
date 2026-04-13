"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
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

      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
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
          background: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #fce4ec 100%)",
        }}
      >
        <div>
          <span className="text-2xl font-semibold tracking-tight text-violet-400">FitFlow</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            Join the community<br />
            <span className="font-semibold text-violet-400">built for wellness.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            Create your account and start managing bookings, classes, and clients effortlessly.
          </p>
        </div>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FitFlow. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <span className="text-2xl font-semibold tracking-tight text-violet-400">FitFlow</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Create your account</h2>
            <p className="text-sm text-gray-500">It only takes a moment to get started</p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
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

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
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

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
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

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
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
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{
                background: loading
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
