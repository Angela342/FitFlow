"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

function getParams() {
  if (typeof window === "undefined") return { email: "", purpose: "register" };
  const p = new URLSearchParams(window.location.search);
  return {
    email: p.get("email") ?? "",
    purpose: (p.get("purpose") ?? "register") as "register" | "reset",
  };
}

export default function VerifyPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [params, setParams] = useState({ email: "", purpose: "register" as "register" | "reset" });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setParams(getParams());
    // focus first box
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    // Accept only digits; if pasting a full code handle it here
    const clean = value.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError("");
    if (clean && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? "";
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const code = digits.join("");

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }

    setLoading(true);
    setError("");
    try {
      if (params.purpose === "register") {
        const { data } = await api.post("/auth/verify-email", {
          email: params.email,
          code,
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
        router.push(data.role === "Admin" ? "/dashboard" : "/");
      } else {
        // For password reset: don't call the API here — just carry the
        // verified code to the reset-password page where it's submitted
        // together with the new password in a single request.
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(params.email)}&code=${encodeURIComponent(code)}`
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Invalid or expired code. Please try again.";
      setError(msg);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [code, params, router, setAuth]);

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (code.length === 6 && !loading) handleSubmit();
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    setError("");
    try {
      const endpoint =
        params.purpose === "register"
          ? "/auth/send-verification"
          : "/auth/forgot-password";
      await api.post(endpoint, { email: params.email });
      setResendCooldown(60);
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const title = params.purpose === "register" ? "Verify your email" : "Check your email";
  const subtitle =
    params.purpose === "register"
      ? "We sent a 6-digit code to"
      : "We sent a password reset code to";

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
            <MailCheck size={30} style={{ color: "#D4698A" }} strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl font-light text-gray-700 leading-snug">
            One step away
            <br />
            <span className="font-semibold text-rose-400">from your studio.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-sm">
            Enter the code we sent to your email to continue.
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
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">
              {subtitle}{" "}
              <span className="font-medium text-gray-700">{params.email}</span>
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6-digit OTP input */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 rounded-xl border text-center text-xl font-bold text-gray-800 outline-none transition
                    focus:ring-2 focus:ring-rose-100 focus:border-rose-300
                    ${d ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white"}
                    ${error ? "border-rose-400" : ""}`}
                  disabled={loading}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{
                background:
                  loading || code.length < 6
                    ? "#f9a8d4"
                    : "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Verifying…" : "Verify"}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-500">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-400 hover:text-rose-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-400">
            <Link href="/auth/login" className="text-rose-400 hover:text-rose-500 transition">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
