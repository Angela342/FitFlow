"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  Globe,
  Users,
  CreditCard,
  Bell,
  BarChart2,
  CalendarPlus,
  MousePointerClick,
  LayoutDashboard,
  Menu,
  X,
  Home,
  Settings,
  Star,
  Instagram,
  Twitter,
  Facebook,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

const FEATURES = [
  {
    icon: Calendar,
    title: "Easy Class Scheduling",
    description:
      "Create and manage your class schedule with an intuitive drag-and-drop calendar.",
  },
  {
    icon: Globe,
    title: "Online Booking System",
    description:
      "Let clients book classes 24/7 from any device with a beautiful booking page.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Keep track of client profiles, attendance history, and preferences.",
  },
  {
    icon: CreditCard,
    title: "Payment Integration",
    description:
      "Accept payments and sell class packages seamlessly with integrated billing.",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description:
      "Reduce no-shows with automatic email and SMS reminders before each class.",
  },
  {
    icon: BarChart2,
    title: "Analytics & Insights",
    description:
      "Understand your studio's performance with clear, actionable analytics.",
  },
];

const STEPS = [
  {
    number: "01",
    icon: CalendarPlus,
    title: "Create Your Schedule",
    description: "Set up your classes, times, and availability in minutes.",
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: "Let Clients Book Online",
    description: "Share your booking page and let clients reserve their spot instantly.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Manage Everything",
    description: "Track bookings, payments, and clients from one simple dashboard.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-gray-900">Fit</span>
          <span style={{ color: "#D4698A" }}>Flow</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#D4698A" }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            <Link href="/auth/login" className="text-sm text-gray-600">
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full px-5 py-2 text-sm font-medium text-white text-center"
              style={{ backgroundColor: "#D4698A" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/** Decorative abstract wave/ribbon SVG — matches the design's right-side illustration */
function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-lg drop-shadow-xl"
        aria-hidden="true"
      >
        <defs>
          {/* Pink ribbon gradient */}
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9A8C9" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F06292" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F9C8DA" stopOpacity="0.6" />
          </linearGradient>

          {/* White/lilac blob gradient */}
          <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D8C8EE" stopOpacity="0.85" />
          </linearGradient>

          {/* Second ribbon gradient */}
          <linearGradient id="ribbon2Grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBAAC8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F9D0E0" stopOpacity="0.4" />
          </linearGradient>

          <filter id="softBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <filter id="subtleBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Glow background */}
        <ellipse cx="300" cy="210" rx="180" ry="130" fill="#F9C0D8" opacity="0.18" filter="url(#softBlur)" />

        {/* Main flowing pink ribbon */}
        <path
          d="M 60 300
             C 80 260, 160 230, 240 200
             C 320 170, 400 190, 450 160
             C 470 148, 480 135, 470 125
             C 460 115, 440 120, 420 135
             C 370 165, 290 145, 210 175
             C 130 205, 50 235, 40 275
             C 35 295, 45 315, 60 300 Z"
          fill="url(#ribbonGrad)"
        />

        {/* Second ribbon — slightly below, lighter */}
        <path
          d="M 80 330
             C 110 295, 190 265, 270 240
             C 350 215, 430 230, 465 205
             C 478 197, 482 186, 474 178
             C 466 170, 450 175, 430 188
             C 385 215, 305 200, 225 225
             C 145 250, 65 280, 55 315
             C 50 332, 60 348, 80 330 Z"
          fill="url(#ribbon2Grad)"
        />

        {/* Rounded rect blob — white/lavender, top right */}
        <rect
          x="280"
          y="60"
          width="190"
          height="240"
          rx="40"
          ry="40"
          fill="url(#blobGrad)"
          opacity="0.88"
        />

        {/* Small accent circle */}
        <circle cx="268" cy="185" r="18" fill="#ffffff" opacity="0.7" />
        <circle cx="268" cy="185" r="10" fill="#F9A8C9" opacity="0.5" />
      </svg>
    </div>
  );
}

function FeatureIcon({ Icon }: { Icon: React.ElementType }) {
  return (
    <div
      className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{ backgroundColor: "#F5EEF8" }}
    >
      <Icon size={22} style={{ color: "#D4698A" }} strokeWidth={1.8} />
    </div>
  );
}

function StepIcon({ Icon }: { Icon: React.ElementType }) {
  return (
    <div
      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
      }}
    >
      <Icon size={26} className="text-white" strokeWidth={1.8} />
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative min-h-screen pt-20"
      style={{
        background:
          "linear-gradient(120deg, #fce7f0 0%, #f3eaf8 45%, #e8e6f2 100%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2">
        {/* Left — copy */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl">
            Effortless Booking for Your Studio
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-500">
            Manage classes, clients, and bookings all in one place.
            <br />
            Built for Pilates, yoga, and wellness studios.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/auth/register"
              className="rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4698A" }}
            >
              Get Started
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
            >
              Book a Demo
            </Link>
          </div>
        </div>

        {/* Right — illustration */}
        <div className="flex h-80 w-full items-center justify-center md:h-auto">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Everything Your Studio Needs
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Powerful tools designed specifically for wellness and fitness studios.
          </p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <FeatureIcon Icon={feature.icon} />
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-28"
      style={{ backgroundColor: "#F5F3FA" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">How It Works</h2>
          <p className="mt-4 text-base text-gray-500">
            Get started in three simple steps.
          </p>
        </div>

        {/* 3 steps */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <StepIcon Icon={step.icon} />
              <p
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: "#A78BCA" }}
              >
                Step {step.number}
              </p>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Mockup ────────────────────────────────────────────────────────

const SIDEBAR_ICONS = [
  { icon: LayoutGrid, active: false },
  { icon: Home,        active: false },
  { icon: BarChart2,   active: true  },
  { icon: Users,       active: false },
  { icon: Bell,        active: false, badge: true },
  { icon: Settings,    active: false },
];

const DAYS = [
  { label: "Sun", date: "31" },
  { label: "Mon", date: "18", dot: true },
  { label: "Tue", date: "16" },
  { label: "Wed", date: "19" },
  { label: "Thu", date: "3–4" },
];

const TIMES = ["8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm"];

// Each event: col (0-4 = Sun-Thu), top% from grid top, height% of grid, colour
const EVENTS = [
  { col: 1, top:  8, h: 22, color: "#FBCFE8", border: "#F472B6", title: "Reformer Pilates",  sub: "8 clients · 9:00–10:30" },
  { col: 2, top:  0, h: 18, color: "#DDD6FE", border: "#A78BFA", title: "Mat Pilates",        sub: "6 clients · 8:00–9:30"  },
  { col: 3, top: 16, h: 20, color: "#BFDBFE", border: "#60A5FA", title: "Yoga Flow",           sub: "4 clients · 9:30–11:00" },
  { col: 0, top: 38, h: 22, color: "#FBCFE8", border: "#F472B6", title: "Reformer Pilates",  sub: "7 clients · 11:00–12:30" },
  { col: 1, top: 34, h: 18, color: "#DDD6FE", border: "#A78BFA", title: "Mat Pilates",        sub: "5 clients · 10:30–12:00" },
  { col: 4, top: 42, h: 16, color: "#BFDBFE", border: "#60A5FA", title: "Yoga Flow",           sub: "6 clients · 11:30–1:00" },
  { col: 2, top: 60, h: 20, color: "#FBCFE8", border: "#F472B6", title: "Reformer Pilates",  sub: "8 clients · 1:00–2:30"  },
  { col: 4, top: 62, h: 18, color: "#DDD6FE", border: "#A78BFA", title: "Mat Pilates",        sub: "5 clients · 1:30–3:00"  },
];

const CLIENTS = [
  { initials: "KO", name: "Kod Onloge Fnow",  role: "3 sessions · 15:10–06",  tag: "8/7",  tagColor: "#F472B6" },
  { initials: "TV", name: "Tutocfing Vowa",   role: "Fri 9:00–10:30",          tag: "3.1",  tagColor: "#60A5FA" },
  { initials: "AT", name: "Afonse Ye Ins",    role: "Mon 2:00, 8:20 M",        tag: "18.22", tagColor: "#34D399" },
  { initials: "SD", name: "Seir Dhocokom",    role: "Qoods · 8:6-07",          tag: "38.1", tagColor: "#F472B6" },
  { initials: "PK", name: "Pidfovk Ykngs",    role: "Fri 0:00, 0:30",          tag: "J27",  tagColor: "#60A5FA" },
  { initials: "TB", name: "Ty.brax Boffow",   role: "—",                        tag: "Join", tagColor: "#A78BFA" },
];

function DashboardMockup() {
  return (
    <div className="flex h-[460px] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 text-xs">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="flex w-14 flex-col items-center gap-1 border-r border-gray-100 bg-white py-4">
        {SIDEBAR_ICONS.map(({ icon: Icon, active, badge }, i) => (
          <div key={i} className="relative my-1">
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors
                ${active ? "bg-green-50" : "hover:bg-gray-100"}`}
            >
              <Icon
                size={16}
                className={active ? "text-green-600" : "text-gray-400"}
                strokeWidth={1.8}
              />
            </button>
            {badge && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white" />
            )}
          </div>
        ))}
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-pink-300 to-purple-400" />
            <div>
              <p className="font-semibold text-gray-800">Pilates Studio</p>
              <p className="text-[10px] text-gray-400">34 clients · 12,300+ sessions · 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "#FCE7F0" }}>
              <Bell size={13} style={{ color: "#D4698A" }} strokeWidth={1.8} />
            </div>
            <button
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-[10px] font-medium text-gray-600"
            >
              <span style={{ color: "#F59E0B" }}>★</span> Today's Classes
            </button>
            <div className="h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-purple-300 to-pink-400" />
          </div>
        </div>

        {/* Calendar area */}
        <div className="flex-1 overflow-hidden p-3">
          {/* Calendar header row */}
          <div className="mb-1 flex">
            <div className="w-10 shrink-0" />
            {DAYS.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center py-1">
                <span className="text-[10px] font-medium text-gray-400">{d.label}</span>
                <span className={`mt-0.5 text-xs font-bold ${d.dot ? "text-gray-800" : "text-gray-500"}`}>
                  {d.date}
                </span>
                {d.dot && <span className="mt-0.5 h-1 w-1 rounded-full bg-gray-800" />}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="relative flex h-[340px]">
            {/* Time labels */}
            <div className="flex w-10 shrink-0 flex-col justify-between pb-2">
              {TIMES.map((t) => (
                <span key={t} className="text-[9px] text-gray-300">{t}</span>
              ))}
            </div>

            {/* Column grid */}
            <div className="relative flex flex-1 gap-1">
              {/* Horizontal rule lines */}
              {TIMES.map((_, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute left-0 right-0 border-t border-gray-100"
                  style={{ top: `${(i / (TIMES.length - 1)) * 100}%` }}
                />
              ))}

              {/* Day columns */}
              {DAYS.map((d, colIdx) => (
                <div key={d.label} className="relative flex-1" />
              ))}

              {/* Events — absolutely placed across the full grid */}
              {EVENTS.map((ev, i) => {
                const colW = 100 / DAYS.length;
                return (
                  <div
                    key={i}
                    className="absolute overflow-hidden rounded-lg px-2 py-1"
                    style={{
                      left:   `calc(${ev.col * colW}% + 2px)`,
                      width:  `calc(${colW}% - 4px)`,
                      top:    `${ev.top}%`,
                      height: `${ev.h}%`,
                      backgroundColor: ev.color,
                      borderLeft: `2.5px solid ${ev.border}`,
                    }}
                  >
                    <p className="truncate text-[9px] font-semibold text-gray-700">{ev.title}</p>
                    <p className="truncate text-[8px] text-gray-500">{ev.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────── */}
      <aside className="flex w-52 shrink-0 flex-col gap-3 overflow-y-auto border-l border-gray-100 bg-white p-3">
        {/* Stat: pink */}
        <div className="rounded-2xl p-3" style={{ backgroundColor: "#FFF0F6" }}>
          <p className="text-[10px] font-medium text-gray-500">Booking</p>
          <p className="my-1 text-3xl font-extrabold" style={{ color: "#D4698A" }}>33</p>
          <p className="text-[9px] text-gray-400">9:00am–12:00pm</p>
          <div className="mt-2 flex items-center gap-2 text-[9px] text-gray-400">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: "#F472B6" }} /> 5 Reformer</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: "#A78BFA" }} /> 4 Mat</span>
          </div>
        </div>

        {/* Stat: blue */}
        <div className="relative rounded-2xl p-3" style={{ backgroundColor: "#EFF6FF" }}>
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500" />
          <p className="text-[10px] font-medium text-gray-500">Booking</p>
          <p className="my-1 text-3xl font-extrabold" style={{ color: "#3B82F6" }}>49</p>
          <p className="text-[9px] text-gray-400">10:00am–6:00pm</p>
          <div className="mt-2 flex items-center gap-2 text-[9px] text-gray-400">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: "#60A5FA" }} /> 8 sessions</span>
          </div>
        </div>

        {/* Recent clients */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-700">Recent Clients</p>
            <button className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <ChevronRight size={10} />
            </button>
          </div>
          <p className="mb-3 text-[9px] text-gray-400">Booking · 1415</p>
          <div className="flex flex-col gap-2">
            {CLIENTS.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#f9a8d4,#a78bca)" }}
                >
                  {c.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-gray-700">{c.name}</p>
                  <p className="truncate text-[8px] text-gray-400">{c.role}</p>
                </div>
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white"
                  style={{ backgroundColor: c.tagColor }}
                >
                  {c.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function DashboardPreviewSection() {
  return (
    <section id="dashboard" className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Your Studio, At a Glance
          </h2>
          <p className="mt-4 text-base text-gray-500">
            A beautifully designed dashboard that gives you full control over classes, bookings,
            <br className="hidden sm:block" />
            and client management.
          </p>
        </div>

        {/* Outer floating card */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
          {/* Fade-in fade-out effect at top/bottom mimicking the design */}
          <div className="relative">
            <DashboardMockup />
            {/* Bottom fade overlay */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.95) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      '"FitFlow completely transformed how I manage my studio. My clients love the easy booking, and I\'ve cut admin work in half!"',
    name: "Sarah Mitchell",
    role: "Pilates Studio Owner",
  },
  {
    quote:
      '"I was spending hours on scheduling every week. Now it takes me 10 minutes. FitFlow is honestly a game-changer."',
    name: "Emma Rodriguez",
    role: "Yoga Instructor",
  },
  {
    quote:
      '"The dashboard gives me everything I need at a glance. Our no-show rate dropped 40% thanks to automated reminders."',
    name: "Olivia Chen",
    role: "Wellness Center Director",
  },
];

function Stars() {
  return (
    <div className="mb-5 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={18} fill="#F472B6" style={{ color: "#F472B6" }} />
      ))}
    </div>
  );
}

function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-28"
      style={{ backgroundColor: "#F5F3FA" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Loved by Studio Owners
          </h2>
          <p className="mt-4 text-base text-gray-500">
            See what our customers have to say.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-3xl bg-white p-8 shadow-sm"
            >
              <Stars />
              <p className="mb-6 flex-1 text-sm italic leading-relaxed text-gray-600">
                {t.quote}
              </p>
              <div>
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="mt-0.5 text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section
      className="py-28 text-center"
      style={{
        background:
          "linear-gradient(120deg, #fce7f0 0%, #f3eaf8 45%, #e8e6f2 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Start managing your studio the smart way
        </h2>
        <p className="mt-5 text-base text-gray-500">
          Join hundreds of studio owners who save time and grow their business
          <br className="hidden sm:block" />
          with FitFlow.
        </p>
        <div className="mt-10">
          <Link
            href="/auth/register"
            className="inline-block rounded-full px-10 py-4 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#D4698A" }}
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing",  href: "#pricing" },
  { label: "Contact",  href: "#contact" },
  { label: "Privacy",  href: "#privacy" },
];

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main row */}
        <div className="flex flex-col items-center gap-6 border-b border-gray-100 py-8 md:flex-row md:justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="text-gray-900">Fit</span>
            <span style={{ color: "#D4698A" }}>Flow</span>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Instagram" className="text-gray-400 transition-colors hover:text-gray-700">
              <Instagram size={18} strokeWidth={1.8} />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-gray-400 transition-colors hover:text-gray-700">
              <Twitter size={18} strokeWidth={1.8} />
            </Link>
            <Link href="#" aria-label="Facebook" className="text-gray-400 transition-colors hover:text-gray-700">
              <Facebook size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 text-center">
          <p className="text-xs text-gray-400">
            © 2026 FitFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
