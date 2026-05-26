"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { categories, getAllMastersWithProfiles } from "@/lib/mock/data";
import { DISTRICTS } from "@/constants";

/* ────────────────────────────────────────────────────────────────────────────
   Stars Component
   ──────────────────────────────────────────────────────────────────────────── */
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Animated Counter
   ──────────────────────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
      <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{value}{suffix}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Category colors (unique per category)
   ──────────────────────────────────────────────────────────────────────────── */
const CAT_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "cat-1": { bg: "bg-blue-50", text: "text-blue-600", ring: "hover:ring-blue-200" },
  "cat-2": { bg: "bg-amber-50", text: "text-amber-600", ring: "hover:ring-amber-200" },
  "cat-3": { bg: "bg-orange-50", text: "text-orange-600", ring: "hover:ring-orange-200" },
  "cat-4": { bg: "bg-violet-50", text: "text-violet-600", ring: "hover:ring-violet-200" },
  "cat-5": { bg: "bg-rose-50", text: "text-rose-600", ring: "hover:ring-rose-200" },
  "cat-6": { bg: "bg-pink-50", text: "text-pink-600", ring: "hover:ring-pink-200" },
  "cat-7": { bg: "bg-teal-50", text: "text-teal-600", ring: "hover:ring-teal-200" },
  "cat-8": { bg: "bg-red-50", text: "text-red-600", ring: "hover:ring-red-200" },
  "cat-9": { bg: "bg-indigo-50", text: "text-indigo-600", ring: "hover:ring-indigo-200" },
  "cat-10": { bg: "bg-emerald-50", text: "text-emerald-600", ring: "hover:ring-emerald-200" },
};

/* ────────────────────────────────────────────────────────────────────────────
   Master Card — Premium Redesign
   ──────────────────────────────────────────────────────────────────────────── */
function MasterCard({ master, index }: { master: ReturnType<typeof getAllMastersWithProfiles>[0]; index: number }) {
  const { profile } = master;
  const cat = categories.find((c) => c.id === profile.categories[0]);
  const catColor = CAT_COLORS[profile.categories[0]] || CAT_COLORS["cat-1"];

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-200 transition-all duration-300 overflow-hidden flex flex-col"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", animationDelay: `${index * 0.08}s` }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"; }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-[3px] ring-gray-50">
              <Image src={master.avatar} alt={master.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
            </div>
            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[2.5px] border-white ${profile.isAvailable ? "bg-emerald-500" : "bg-gray-300"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0A0A0A] text-base truncate leading-snug">{master.name}</h3>
            {cat && (
              <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>
                {cat.icon} {cat.name}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3.5">
          <Stars rating={profile.rating} size={15} />
          <span className="text-sm font-bold text-[#0A0A0A]">{profile.rating.toFixed(1)}</span>
          <span className="text-xs text-[#6B7280]">({profile.reviewCount} ta sharh)</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-2">
          <svg className="w-3.5 h-3.5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-[#374151]">{profile.location.district}, Toshkent</span>
        </div>

        {/* Availability pill */}
        <div className="mt-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${profile.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${profile.isAvailable ? "bg-emerald-500" : "bg-gray-400"}`} />
            {profile.isAvailable ? "Bo'sh" : "Band"}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <Link href={`/master/${master.id}`}
            className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white transition-all duration-200 active:scale-[0.97]">
            Batafsil →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const allMasters = useMemo(() => getAllMastersWithProfiles(), []);
  const topMasters = useMemo(
    () => [...allMasters].sort((a, b) => b.profile.rating - a.profile.rating).slice(0, 6),
    [allMasters]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory) params.set("category", searchCategory);
    if (searchLocation) params.set("district", searchLocation);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO SECTION — Animated gradient
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B1120 0%, #0F1D2F 35%, #0A3D2E 70%, #0B1120 100%)", backgroundSize: "300% 300%", animation: "gradient-shift 12s ease infinite" }}>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Floating decorative cards */}
        <div className="absolute top-32 right-[15%] w-20 h-14 bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.06] pointer-events-none animate-float hidden lg:block" style={{ animationDelay: "0s" }} />
        <div className="absolute top-48 right-[8%] w-16 h-12 bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.05] pointer-events-none animate-float hidden lg:block" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-40 left-[12%] w-24 h-16 bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] pointer-events-none animate-float hidden lg:block" style={{ animationDelay: "0.8s" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.1] text-brand-400 text-sm font-medium mb-10 animate-fade-in">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-soft" />
            O&apos;zbekistondagi #1 ustalar platformasi
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
            Kerakli ustani top,{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00C896, #34D399, #2DD4BF)" }}>
                qisqa vaqtda ishingizni bitiring
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 12" fill="none">
                <path d="M2 8 Q100 2 200 8 Q300 14 398 8" stroke="url(#hero-grad)" strokeWidth="3" strokeLinecap="round" />
                <defs><linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00C896" /><stop offset="100%" stopColor="#2DD4BF" />
                </linearGradient></defs>
              </svg>
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            O&apos;zbekistondagi eng yaxshi ustalar bir joyda — tez toping, ishonch bilan bog&apos;laning.
          </p>

          {/* Search Bar — Glassmorphism */}
          <form onSubmit={handleSearch}
            className="mt-12 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔧</span>
              <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full h-14 pl-11 pr-4 rounded-2xl bg-white/[0.08] backdrop-blur-md text-white border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all text-sm appearance-none cursor-pointer">
                <option value="" className="text-gray-900 bg-white">Barcha kategoriyalar</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="text-gray-900 bg-white">{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">📍</span>
              <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full h-14 pl-11 pr-4 rounded-2xl bg-white/[0.08] backdrop-blur-md text-white border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all text-sm appearance-none cursor-pointer">
                <option value="" className="text-gray-900 bg-white">Barcha tumanlar</option>
                {DISTRICTS.map((d) => <option key={d} value={d} className="text-gray-900 bg-white">{d}</option>)}
              </select>
            </div>
            <button type="submit"
              className="h-14 px-8 rounded-2xl font-semibold text-white text-sm whitespace-nowrap transition-all duration-200 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #00C896, #00A87E)", boxShadow: "0 4px 20px rgba(0,200,150,0.3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,200,150,0.45)"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,200,150,0.3)"; e.currentTarget.style.transform = "scale(1)"; }}>
              🔍 Qidirish
            </button>
          </form>

          {/* Stats */}
          <div className="mt-16 flex items-center justify-center gap-10 sm:gap-20 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { value: "500", suffix: "+", label: "Ustalar" },
              { value: "10K", suffix: "+", label: "Mijozlar" },
              { value: "4.8", suffix: " ★", label: "O'rtacha baho" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
                <div className="text-sm text-gray-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0 50 C360 0 1080 0 1440 50 L1440 50 L0 50 Z" fill="#F8FAFB" /></svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. CATEGORIES — Unique colors per category
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Kategoriyalar</span>
            <h2 className="mt-3 section-title">Qaysi sohada yordam kerak?</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide sm:grid sm:grid-cols-5 sm:gap-5 sm:overflow-visible sm:pb-0">
            {categories.map((cat) => {
              const color = CAT_COLORS[cat.id] || CAT_COLORS["cat-1"];
              return (
                <Link key={cat.id} href={`/search?category=${cat.id}`}
                  className={`snap-start shrink-0 w-36 sm:w-auto group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 ring-2 ring-transparent ${color.ring} hover:border-transparent transition-all duration-300`}
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}>
                  <div className={`w-14 h-14 rounded-2xl ${color.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-bold text-[#0A0A0A] text-center leading-tight">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. TOP MASTERS — Premium cards
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label">Reyting bo&apos;yicha</span>
              <h2 className="mt-3 section-title">Eng yaxshi ustalar</h2>
            </div>
            <Link href="/search"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors group">
              Hammasini ko&apos;rish
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {topMasters.map((master, i) => <MasterCard key={master.id} master={master} index={i} />)}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/search" className="btn-outline text-sm inline-flex items-center gap-2">
              Barcha ustalarni ko&apos;rish →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B1120, #111827)" }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Jarayon</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white tracking-tight">Qanday ishlaydi?</h2>
          <p className="mt-4 text-gray-400 max-w-lg mx-auto">3 ta oddiy qadam bilan kerakli ustani toping va ishni boshlang</p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector */}
            <div className="hidden sm:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-brand-500/0 via-brand-500/30 to-brand-500/0" />

            {[
              { num: "01", icon: "📋", title: "Kategoriya tanlang", desc: "Kerakli xizmat turini tanlang — santexnikdan tortib dasturchigacha" },
              { num: "02", icon: "🔍", title: "Ustani toping", desc: "Reyting, joylashuv va tajriba bo'yicha eng yaxshi ustani tanlang" },
              { num: "03", icon: "📞", title: "Bog'laning", desc: "Usta bilan to'g'ridan to'g'ri bog'laning va ishni boshlang" },
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center group">
                <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #00C896, #00A87E)", boxShadow: "0 8px 30px rgba(0,200,150,0.2)" }}>
                  <span className="text-4xl">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 border-2 border-brand-500 text-brand-400 text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/search" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-200 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #00C896, #00A87E)", boxShadow: "0 4px 20px rgba(0,200,150,0.3)" }}>
              Hoziroq boshlang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
