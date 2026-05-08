"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { categories, getAllMastersWithProfiles } from "@/lib/mock/data";
import { DISTRICTS } from "@/constants";

// ─── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Master Card ───────────────────────────────────────────────────────────────
function MasterCard({ master }: { master: ReturnType<typeof getAllMastersWithProfiles>[0] }) {
  const { profile } = master;
  const cat = categories.find((c) => c.id === profile.categories[0]);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 ring-2 ring-slate-50">
              <Image
                src={master.avatar}
                alt={master.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                profile.isAvailable ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate leading-tight">
              {master.name}
            </h3>
            {cat && (
              <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
            )}
          </div>

          <span className="shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {profile.experience} yil
          </span>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 mt-3">
          <Stars rating={profile.rating} />
          <span className="text-xs font-semibold text-slate-700">{profile.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({profile.reviewCount} ta sharh)</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{profile.location.district}, Toshkent</span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-1.5 mt-1.5 text-xs">
          <span className={profile.isAvailable ? "text-emerald-600" : "text-slate-400"}>
            {profile.isAvailable ? "● Bo'sh" : "● Band"}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link
            href={`/master/${master.id}`}
            className="block w-full text-center py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-all duration-200"
          >
            Batafsil →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
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
    <div className="bg-slate-50 min-h-screen">

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            O&apos;zbekistondagi #1 ustalar platformasi
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Kerakli ustani top,{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                ishingni bit
              </span>
              {/* underline accent */}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="mt-7 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            O&apos;zbekistondagi eng yaxshi ustalar bir joyda — tez toping, ishonch bilan
            bog&apos;laning.
          </p>

          {/* ── Search Bar ── */}
          <form
            onSubmit={handleSearch}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto"
          >
            {/* Category */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                🔧
              </span>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full h-14 pl-10 pr-4 rounded-xl bg-white/10 backdrop-blur text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/15 transition text-sm appearance-none"
              >
                <option value="" className="text-slate-900 bg-white">
                  Barcha kategoriyalar
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="text-slate-900 bg-white">
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                📍
              </span>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full h-14 pl-10 pr-4 rounded-xl bg-white/10 backdrop-blur text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/15 transition text-sm appearance-none"
              >
                <option value="" className="text-slate-900 bg-white">
                  Barcha tumanlar
                </option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d} className="text-slate-900 bg-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="h-14 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-[0.98] text-sm whitespace-nowrap"
            >
              🔍 Qidirish
            </button>
          </form>

          {/* Quick stats */}
          <div className="mt-12 flex items-center justify-center gap-8 sm:gap-16">
            {[
              { value: "500+", label: "Ustalar" },
              { value: "10K+", label: "Mijozlar" },
              { value: "4.8 ★", label: "O'rtacha baho" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. CATEGORIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              Kategoriyalar
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Qaysi sohada yordam kerak?
            </h2>
          </div>

          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.id}`}
                className="snap-start shrink-0 w-32 sm:w-auto group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. TOP MASTERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Reyting bo&apos;yicha
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Eng yaxshi ustalar
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Hammasini ko&apos;rish
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topMasters.map((master) => (
              <MasterCard key={master.id} master={master} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors text-sm"
            >
              Barcha ustalarni ko&apos;rish →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            Jarayon
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Qanday ishlaydi?
          </h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            3 ta oddiy qadam bilan kerakli ustani toping va ishni boshlang
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 pointer-events-none" />

            {[
              {
                num: "01",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h8" />
                  </svg>
                ),
                title: "Kategoriya tanlang",
                desc: "Kerakli xizmat turini tanlang — santexnikdan tortib dasturchi va dizayngergacha",
              },
              {
                num: "02",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Ustani toping",
                desc: "Reyting, narx va joylashuv bo'yicha eng yaxshi ustani tanlang",
              },
              {
                num: "03",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                title: "Bog'laning",
                desc: "Usta bilan to'g'ridan to'g'ri bog'laning va ishni boshlang",
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Number circle */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-300 mb-5">
                  <div className="text-white">{step.icon}</div>
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-800 border-2 border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-[220px] mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/40 active:scale-[0.98]"
            >
              Hoziroq boshlang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                  X
                </div>
                <span className="text-lg font-bold text-white">Xalq Uchun</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                O&apos;zbekistondagi eng yaxshi ustalar platformasi. Kerakli ustani
                tez va ishonchli toping.
              </p>
            </div>

            {/* Nav */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Sahifalar
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/home", label: "🏠 Bosh sahifa" },
                  { href: "/search", label: "🔍 Qidirish" },
                  { href: "/login", label: "🔑 Kirish" },
                  { href: "/register", label: "✍️ Ro'yxatdan o'tish" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm hover:text-emerald-400 transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Aloqa
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-base">📞</span>
                  <span>+998 90 123 45 67</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base">✉️</span>
                  <span>info@xalquchun.uz</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span>Toshkent, O&apos;zbekiston</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © 2024 Xalq Uchun. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-4">
              {["Telegram", "Instagram", "YouTube"].map((soc) => (
                <a
                  key={soc}
                  href="#"
                  className="text-xs text-slate-600 hover:text-emerald-400 transition-colors duration-200"
                >
                  {soc}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
