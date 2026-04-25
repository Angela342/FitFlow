"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SessionDto {
  id: string;
  classId: string;
  className: string;
  instructor: string;
  colorLabel: string;
  durationMinutes: number;
  maxCapacity: number;
  price: number;
  category?: string;
  startTime: string;
  status: string;
  currentEnrollment: number;
  spotsAvailable: number;
  notes?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const DAYS = [
  { short: "Mon", label: "Monday" },
  { short: "Tue", label: "Tuesday" },
  { short: "Wed", label: "Wednesday" },
  { short: "Thu", label: "Thursday" },
  { short: "Fri", label: "Friday" },
  { short: "Sat", label: "Saturday" },
  { short: "Sun", label: "Sunday" },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<number>(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Mon=0 … Sun=6
  });

  const weekEnd = addDays(weekStart, 7);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/classes/sessions", {
        params: {
          from: weekStart.toISOString(),
          to: weekEnd.toISOString(),
        },
      });
      // Only show scheduled sessions to clients
      setSessions((data as SessionDto[]).filter(s => s.status === "Scheduled"));
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [weekStart]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const prevWeek = () => { setWeekStart(prev => addDays(prev, -7)); setActiveDay(0); };
  const nextWeek = () => { setWeekStart(prev => addDays(prev, 7)); setActiveDay(0); };

  const weekLabel = `${weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${addDays(weekStart, 6).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  const activeDaySessions = sessions.filter(
    s => isoDate(new Date(s.startTime)) === isoDate(addDays(weekStart, activeDay))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div
        className="py-12 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)" }}
      >
        <h1 className="text-3xl font-light text-gray-700">
          Class <span className="font-semibold text-rose-400">Schedule</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          Browse this week&apos;s classes and find the perfect session for you.
        </p>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Week navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevWeek}
            className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:border-rose-200 hover:text-rose-400"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-700">{weekLabel}</span>
          <button
            onClick={nextWeek}
            className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:border-rose-200 hover:text-rose-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6">
          {DAYS.map((day, i) => {
            const date = addDays(weekStart, i);
            const isToday = isoDate(date) === isoDate(new Date());
            const count = sessions.filter(
              s => isoDate(new Date(s.startTime)) === isoDate(date)
            ).length;
            return (
              <button
                key={day.short}
                onClick={() => setActiveDay(i)}
                className={`flex flex-col items-center flex-shrink-0 rounded-2xl px-4 py-3 transition ${
                  activeDay === i
                    ? "text-white shadow"
                    : "bg-white border border-gray-100 text-gray-500 hover:border-rose-100"
                }`}
                style={
                  activeDay === i
                    ? { background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }
                    : {}
                }
              >
                <span className="text-xs font-medium">{day.short}</span>
                <span className={`text-base font-semibold ${isToday && activeDay !== i ? "text-rose-400" : ""}`}>
                  {date.getDate()}
                </span>
                {count > 0 && (
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 rounded-full ${activeDay === i ? "bg-white/70" : "bg-rose-300"}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Sessions for active day */}
        {loading ? (
          <div className="flex justify-center py-12 text-gray-300">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-rose-300" />
          </div>
        ) : activeDaySessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center">
            <p className="text-sm font-medium text-gray-500">No classes scheduled</p>
            <p className="mt-1 text-sm text-gray-400">
              {DAYS[activeDay].label} has no sessions this week.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDaySessions.map(session => (
              <div
                key={session.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md"
              >
                <div
                  className="h-1.5"
                  style={{ backgroundColor: session.colorLabel }}
                />
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  {/* Time badge */}
                  <div className="flex-shrink-0 text-center">
                    <p
                      className="text-xl font-semibold"
                      style={{ color: session.colorLabel }}
                    >
                      {formatTime(session.startTime)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {session.durationMinutes} min
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-12 bg-gray-100" />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-800">{session.className}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{session.instructor}</p>
                      </div>
                      {session.price === 0 ? (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Free</span>
                      ) : (
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">${session.price.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                      {session.category && (
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          {session.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {session.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {session.spotsAvailable} spot{session.spotsAvailable !== 1 ? "s" : ""} left
                      </span>
                    </div>

                    {session.notes && (
                      <p className="mt-2 text-xs text-gray-400 italic">{session.notes}</p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0">
                    {session.spotsAvailable > 0 ? (
                      <button
                        className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)" }}
                        onClick={() => alert("Booking coming soon!")}
                      >
                        Book now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-400"
                      >
                        Full
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
