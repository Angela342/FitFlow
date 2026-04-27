"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2, X, Ban, Trash2 } from "lucide-react";
import AdminRoute from "@/components/auth/AdminRoute";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";

interface ClassDto {
  id: string; name: string; instructor: string;
  colorLabel: string; durationMinutes: number; maxCapacity: number; isActive: boolean;
}

interface SessionDto {
  id: string; classId: string; className: string; instructor: string;
  colorLabel: string; durationMinutes: number; maxCapacity: number; price: number;
  category?: string; startTime: string; status: string;
  currentEnrollment: number; spotsAvailable: number; notes?: string;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date); const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); d.setHours(0,0,0,0); return d;
}
function addDays(date: Date, n: number): Date { const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function isoDate(d: Date): string { return d.toISOString().slice(0,10); }
function formatTime(iso: string): string { return new Date(iso).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}); }
function formatDate(d: Date): string { return d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}); }
function localDatetimeValue(d: Date): string {
  const p = (n: number) => String(n).padStart(2,"0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ classId: "", startTime: "", notes: "" });
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState("");
  const [selected, setSelected] = useState<SessionDto | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const weekEnd = addDays(weekStart, 7);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/classes/sessions", {
        params: { from: weekStart.toISOString(), to: weekEnd.toISOString() },
      });
      setSessions(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [weekStart]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchSessions(); }, [fetchSessions]);
  useEffect(() => { api.get("/classes").then(({data}) => setClasses(data.filter((c: ClassDto) => c.isActive))).catch(()=>{}); }, []);

  const prevWeek = () => setWeekStart(prev => addDays(prev,-7));
  const nextWeek = () => setWeekStart(prev => addDays(prev,7));
  const goToday  = () => setWeekStart(startOfWeek(new Date()));

  const sessionsByDay: SessionDto[][] = DAYS.map((_,i) => {
    const dayDate = isoDate(addDays(weekStart,i));
    return sessions.filter(s => isoDate(new Date(s.startTime)) === dayDate);
  });

  const openCreate = (dayIndex?: number) => {
    const d = addDays(weekStart, dayIndex ?? 0); d.setHours(9,0,0,0);
    setCreateForm({ classId: classes[0]?.id ?? "", startTime: localDatetimeValue(d), notes: "" });
    setCreateError(""); setCreateOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreateSaving(true); setCreateError("");
    try {
      await api.post("/classes/sessions", {
        classId: createForm.classId,
        startTime: new Date(createForm.startTime).toISOString(),
        notes: createForm.notes || null,
      });
      setCreateOpen(false); fetchSessions();
    } catch (err: unknown) {
      setCreateError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create session.");
    } finally { setCreateSaving(false); }
  };

  const handleCancel = async (s: SessionDto) => {
    if (!confirm(`Cancel "${s.className}" at ${formatTime(s.startTime)}?`)) return;
    setActionLoading(true);
    try {
      const { data } = await api.patch(`/classes/sessions/${s.id}/cancel`);
      setSessions(prev => prev.map(x => x.id === data.id ? data : x)); setSelected(data);
    } catch { alert("Failed to cancel."); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async (s: SessionDto) => {
    if (!confirm("Delete this session permanently?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/classes/sessions/${s.id}`);
      setSessions(prev => prev.filter(x => x.id !== s.id)); setSelected(null);
    } catch { alert("Failed to delete."); }
    finally { setActionLoading(false); }
  };

  const weekLabel = `${weekStart.toLocaleDateString("en-US",{month:"long",day:"numeric"})} – ${addDays(weekStart,6).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Schedule</h1>
              <p className="mt-0.5 text-sm text-gray-500">Weekly class sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={goToday} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-rose-200 hover:text-rose-400">Today</button>
              <button onClick={prevWeek} className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:border-rose-200 hover:text-rose-400"><ChevronLeft size={18} /></button>
              <span className="min-w-[200px] text-center text-sm font-medium text-gray-700">{weekLabel}</span>
              <button onClick={nextWeek} className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:border-rose-200 hover:text-rose-400"><ChevronRight size={18} /></button>
              <button onClick={() => openCreate()} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm"
                style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
                <Plus size={16} /> Add session
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map((day,i) => {
                const date = addDays(weekStart,i);
                const isToday = isoDate(date) === isoDate(new Date());
                return (
                  <div key={day} className="border-r border-gray-100 px-3 py-3 last:border-r-0 text-center">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isToday ? "text-rose-400" : "text-gray-400"}`}>{day}</p>
                    <p className={`mt-0.5 text-sm font-semibold ${isToday ? "text-rose-500" : "text-gray-700"}`}>{date.getDate()}</p>
                  </div>
                );
              })}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-300"><Loader2 size={28} className="animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-7 min-h-[320px]">
                {sessionsByDay.map((daySessions,i) => (
                  <div key={i} className="border-r border-gray-50 last:border-r-0 p-2 flex flex-col gap-1.5">
                    {daySessions.map(s => (
                      <button key={s.id} onClick={() => setSelected(s)}
                        className={`w-full rounded-xl px-2.5 py-2 text-left text-xs transition hover:opacity-80 ${s.status === "Cancelled" ? "opacity-40 line-through" : ""}`}
                        style={{ backgroundColor: s.colorLabel+"33", borderLeft: `3px solid ${s.colorLabel}` }}>
                        <p className="font-semibold text-gray-800 truncate">{s.className}</p>
                        <p className="text-gray-500 mt-0.5">{formatTime(s.startTime)}</p>
                        <p className="text-gray-400 mt-0.5">{s.currentEnrollment}/{s.maxCapacity}</p>
                      </button>
                    ))}
                    <button onClick={() => openCreate(i)}
                      className="mt-auto flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-1.5 text-gray-300 transition hover:border-rose-200 hover:text-rose-300">
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800">Schedule a session</h2>
              <button onClick={() => setCreateOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 px-6 py-5">
              {createError && <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">{createError}</div>}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select required value={createForm.classId} onChange={e => setCreateForm(p=>({...p,classId:e.target.value}))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100">
                  {classes.length === 0 && <option value="">No active classes</option>}
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} — {c.instructor}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Start time</label>
                <input type="datetime-local" required value={createForm.startTime} onChange={e => setCreateForm(p=>({...p,startTime:e.target.value}))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Notes <span className="font-normal text-gray-400">(optional)</span></label>
                <input value={createForm.notes} onChange={e => setCreateForm(p=>({...p,notes:e.target.value}))} placeholder="Any notes…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100" />
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setCreateOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={createSaving || classes.length === 0} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}>
                  {createSaving && <Loader2 size={14} className="animate-spin" />}
                  {createSaving ? "Scheduling…" : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:pr-6"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full sm:w-80 rounded-2xl bg-white shadow-xl border border-gray-100">
            <div className="h-2 rounded-t-2xl" style={{ backgroundColor: selected.colorLabel }} />
            <div className="px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{selected.className}</p>
                  <p className="text-sm text-gray-400">{selected.instructor}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-gray-300 hover:bg-gray-100 transition"><X size={16} /></button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span className="text-gray-400">Time</span><span>{formatDate(new Date(selected.startTime))} · {formatTime(selected.startTime)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Duration</span><span>{selected.durationMinutes} min</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Spots</span><span>{selected.currentEnrollment} / {selected.maxCapacity}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium ${selected.status === "Scheduled" ? "text-emerald-600" : selected.status === "Cancelled" ? "text-rose-500" : "text-gray-500"}`}>{selected.status}</span>
                </div>
                {selected.notes && <div className="pt-1 text-gray-500 italic">&ldquo;{selected.notes}&rdquo;</div>}
              </div>
              {selected.status === "Scheduled" && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleCancel(selected)} disabled={actionLoading}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-medium text-amber-600 transition hover:bg-amber-100 disabled:opacity-50">
                    {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />} Cancel session
                  </button>
                  <button onClick={() => handleDelete(selected)} disabled={actionLoading}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-medium text-rose-500 transition hover:bg-rose-100 disabled:opacity-50">
                    {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete
                  </button>
                </div>
              )}
              {selected.status !== "Scheduled" && (
                <button onClick={() => handleDelete(selected)} disabled={actionLoading}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-medium text-rose-500 transition hover:bg-rose-100 disabled:opacity-50">
                  {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}
