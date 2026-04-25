"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Building2 } from "lucide-react";
import AdminRoute from "@/components/auth/AdminRoute";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import type { Studio } from "@/types";

type FormState = Omit<Studio, "id" | "logoUrl">;

const empty: FormState = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  website: "",
};

export default function StudioSettingsPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/studio")
      .then(({ data }) => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          website: data.website ?? "",
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) setIsNew(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      if (isNew) {
        await api.post("/studio", form);
        setIsNew(false);
      } else {
        await api.put("/studio", form);
      }
      setSuccess(true);
    } catch {
      setError("Failed to save studio settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-2xl px-6 py-10">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #fce4ec, #f3e5f5)",
              }}
            >
              <Building2 size={20} className="text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Studio Settings
              </h1>
              <p className="text-sm text-gray-500">
                {isNew
                  ? "Set up your studio profile to get started"
                  : "Update your studio's public profile"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "#fb7185",
                  borderRightColor: "#c084fc",
                }}
              />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
            >
              {success && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600">
                  Studio settings saved successfully.
                </div>
              )}
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              {/* Studio name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Studio name <span className="text-rose-400">*</span>
                </label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Bojana's Pilates Studio"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell clients what makes your studio special…"
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Wellness Street, City"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="hello@yourstudio.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourstudio.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
                  }}
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? "Saving…" : "Save settings"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}
