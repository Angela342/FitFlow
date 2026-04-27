"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react";
import AdminRoute from "@/components/auth/AdminRoute";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";

interface ClassDto {
  id: string;
  name: string;
  description?: string;
  instructor: string;
  maxCapacity: number;
  durationMinutes: number;
  price: number;
  colorLabel: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
}

type FormData = {
  name: string;
  description: string;
  instructor: string;
  maxCapacity: string;
  durationMinutes: string;
  price: string;
  colorLabel: string;
  category: string;
  isActive: boolean;
};

const EMPTY_FORM: FormData = {
  name: "", description: "", instructor: "",
  maxCapacity: "10", durationMinutes: "60", price: "0",
  colorLabel: "#f9a8d4", category: "", isActive: true,
};

const COLOR_OPTIONS = [
  { value: "#f9a8d4", label: "Rose" },
  { value: "#c4b5fd", label: "Violet" },
  { value: "#6ee7b7", label: "Emerald" },
  { value: "#93c5fd", label: "Sky" },
  { value: "#fcd34d", label: "Amber" },
  { value: "#fdba74", label: "Orange" },
];

const CATEGORIES = ["Pilates", "Yoga", "HIIT", "Barre", "Meditation", "Strength", "Dance", "Other"];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassDto | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchClasses = useCallback(async () => {
    try {
      const { data } = await api.get("/classes");
      setClasses(data);
    } catch { /* silently ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const openCreate = () => {
    setEditTarget(null); setForm(EMPTY_FORM); setError(""); setModalOpen(true);
  };

  const openEdit = (c: ClassDto) => {
    setEditTarget(c);
    setForm({
      name: c.name, description: c.description ?? "", instructor: c.instructor,
      maxCapacity: String(c.maxCapacity), durationMinutes: String(c.durationMinutes),
      price: String(c.price), colorLabel: c.colorLabel, category: c.category ?? "",
      isActive: c.isActive,
    });
    setError(""); setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = {
        name: form.name, description: form.description || null, instructor: form.instructor,
        maxCapacity: parseInt(form.maxCapacity), durationMinutes: parseInt(form.durationMinutes),
        price: parseFloat(form.price), colorLabel: form.colorLabel,
        category: form.category || null, isActive: form.isActive,
      };
      if (editTarget) { await api.put(`/classes/${editTarget.id}`, payload); }
      else { await api.post("/classes", payload); }
      setModalOpen(false); fetchClasses();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong.";
      setError(msg);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this class? All scheduled sessions will also be removed.")) return;
    setDeletingId(id);
    try { await api.delete(`/classes/${id}`); setClasses(prev => prev.filter(c => c.id !== id)); }
    catch { alert("Failed to delete class."); }
    finally { setDeletingId(null); }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Classes</h1>
              <p className="mt-0.5 text-sm text-gray-500">Manage your class offerings</p>
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
              <Plus size={16} /> New class
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 size={24} className="animate-spin" /></div>
            ) : classes.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-gray-600">No classes yet</p>
                <p className="mt-1 text-sm text-gray-400">Create your first class to get started.</p>
                <button onClick={openCreate} className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
                  <Plus size={16} /> New class
                </button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                    <th className="px-6 py-3">Class</th><th className="px-6 py-3">Instructor</th>
                    <th className="px-6 py-3">Duration</th><th className="px-6 py-3">Capacity</th>
                    <th className="px-6 py-3">Price</th><th className="px-6 py-3">Status</th><th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {classes.map(c => (
                    <tr key={c.id} className="group transition hover:bg-gray-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.colorLabel }} />
                          <div>
                            <p className="font-medium text-gray-800">{c.name}</p>
                            {c.category && <p className="text-xs text-gray-400">{c.category}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.instructor}</td>
                      <td className="px-6 py-4 text-gray-600">{c.durationMinutes} min</td>
                      <td className="px-6 py-4 text-gray-600">{c.maxCapacity} spots</td>
                      <td className="px-6 py-4 text-gray-600">{c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-400 transition"><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id} className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition disabled:opacity-40">
                            {deletingId === c.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800">{editTarget ? "Edit class" : "New class"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {error && <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">{error}</div>}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Class name</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Morning Flow Pilates"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Description <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief description…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <input name="instructor" required value={form.instructor} onChange={handleChange} placeholder="Name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100">
                    <option value="">— None —</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Capacity", name: "maxCapacity", min: "1" },
                  { label: "Duration (min)", name: "durationMinutes", min: "5", step: "5" },
                  { label: "Price ($)", name: "price", min: "0", step: "0.01" },
                ].map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                    <input name={f.name} type="number" min={f.min} step={f.step} required
                      value={form[f.name as keyof FormData] as string} onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100" />
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Color label</label>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map(opt => (
                      <button key={opt.value} type="button" onClick={() => setForm(prev => ({ ...prev, colorLabel: opt.value }))} title={opt.label}
                        className={`h-7 w-7 rounded-full transition ${form.colorLabel === opt.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                        style={{ backgroundColor: opt.value }} />
                    ))}
                  </div>
                </div>
                {editTarget && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Active</label>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`flex items-center gap-1.5 text-sm font-medium transition ${form.isActive ? "text-emerald-600" : "text-gray-400"}`}>
                      {form.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      {form.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : editTarget ? "Save changes" : "Create class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}
