"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, getAllMastersWithProfiles } from "@/lib/mock/data";
import { DISTRICTS } from "@/constants";
import { MasterWithProfile } from "@/types";

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-${size} h-${size} ${s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Horizontal Master Card ───────────────────────────────────────────────────
function MasterRow({ master }: { master: MasterWithProfile }) {
  const { profile } = master;
  const cat = categories.find((c) => c.id === profile.categories[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-200 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-slate-50">
            <Image src={master.avatar} alt={master.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
          </div>
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${profile.isAvailable ? "bg-emerald-500" : "bg-slate-300"}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-slate-900">{master.name}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {cat && <span className="text-xs text-slate-500">{cat.icon} {cat.name}</span>}
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">📍 {profile.location.district}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{profile.experience} yil tajriba</span>
              </div>
            </div>
            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${profile.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {profile.isAvailable ? "✓ Bo'sh" : "Band"}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Stars rating={profile.rating} size={4} />
            <span className="text-sm font-semibold text-slate-700">{profile.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({profile.reviewCount} ta sharh)</span>
          </div>

          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{profile.bio}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link href={`/master/${master.id}`} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-all duration-200">
          Profilni ko&apos;rish →
        </Link>
      </div>
    </div>
  );
}

// ─── Star Picker ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(value === s ? 0 : s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className={`text-2xl transition-transform hover:scale-110 ${s <= (hovered || value) ? "text-amber-400" : "text-slate-200"}`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-slate-500 self-center ml-1">{value}+ yulduz</span>
      )}
    </div>
  );
}

// ─── Search Page Inner ────────────────────────────────────────────────────────
function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputVal, setInputVal] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [minRating, setMinRating] = useState(Number(searchParams.get("rating") || 0));
  const [onlyAvailable, setOnlyAvailable] = useState(searchParams.get("available") === "1");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating");
  const [showFilters, setShowFilters] = useState(false);

  const allMasters = useMemo(() => getAllMastersWithProfiles(), []);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (district) params.set("district", district);
    if (minRating) params.set("rating", String(minRating));
    if (onlyAvailable) params.set("available", "1");
    if (sortBy !== "rating") params.set("sort", sortBy);
    const str = params.toString();
    router.replace(`/search${str ? "?" + str : ""}`, { scroll: false });
  }, [query, category, district, minRating, onlyAvailable, sortBy, router]);

  const filtered = useMemo(() => {
    let res = allMasters.filter((m) => {
      const { profile } = m;
      if (query) {
        const q = query.toLowerCase();
        const catName = categories.find((c) => c.id === profile.categories[0])?.name.toLowerCase() || "";
        if (!m.name.toLowerCase().includes(q) && !profile.bio.toLowerCase().includes(q) && !catName.includes(q)) return false;
      }
      if (category && !profile.categories.includes(category)) return false;
      if (district && profile.location.district !== district) return false;
      if (minRating && profile.rating < minRating) return false;
      if (onlyAvailable && !profile.isAvailable) return false;
      return true;
    });

    res = [...res].sort((a, b) => {
      if (sortBy === "reviews") return b.profile.reviewCount - a.profile.reviewCount;
      if (sortBy === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.profile.rating - a.profile.rating;
    });
    return res;
  }, [allMasters, query, category, district, minRating, onlyAvailable, sortBy]);

  const hasFilters = category || district || minRating || onlyAvailable;

  function clearFilters() {
    setCategory(""); setDistrict(""); setMinRating(0); setOnlyAvailable(false);
  }

  // ── Filter Panel (shared for sidebar + mobile sheet) ──────────────────────
  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Filtrlar</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline font-medium">
            Tozalash
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Kategoriya</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition">
          <option value="">Barchasi</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Tuman</label>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition">
          <option value="">Barchasi</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Minimal reyting</label>
        <StarPicker value={minRating} onChange={setMinRating} />
      </div>

      {/* Availability */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="sr-only peer" />
          <div className="w-10 h-6 rounded-full bg-slate-200 peer-checked:bg-emerald-500 transition-colors" />
          <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </div>
        <span className="text-sm text-slate-700 group-hover:text-slate-900">Faqat bo&apos;sh ustalar</span>
      </label>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Saralash</label>
        <div className="space-y-1.5">
          {[
            { val: "rating", label: "⭐ Reyting bo'yicha" },
            { val: "reviews", label: "💬 Sharh soni bo'yicha" },
            { val: "new", label: "🆕 Yangi" },
          ].map((opt) => (
            <button key={opt.val} onClick={() => setSortBy(opt.val)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${sortBy === opt.val ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 pt-10 pb-14 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Usta qidirish</h1>
          <p className="text-slate-400 mb-8">Barcha soha bo&apos;yicha tajribali ustalarni toping</p>

          {/* Search Bar */}
          <form onSubmit={(e) => { e.preventDefault(); setQuery(inputVal); }}
            className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={inputVal} onChange={(e) => { setInputVal(e.target.value); setQuery(e.target.value); }}
                placeholder="Usta ismi yoki kasbi bo'yicha..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 backdrop-blur text-white placeholder:text-slate-400 border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition text-sm" />
            </div>
            <button type="submit"
              className="h-14 px-7 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] whitespace-nowrap text-sm">
              Qidirish
            </button>
          </form>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 32" fill="none"><path d="M0 32 C360 0 1080 0 1440 32 L1440 32 L0 32 Z" fill="#f8fafc" /></svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-300 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtrlar
            {hasFilters && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
            <svg className={`w-4 h-4 ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilters && (
            <div className="mt-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <FilterPanel />
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results count + active filters */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900 text-base">{filtered.length}</span> ta usta topildi
              </p>

              {/* Active filter chips */}
              <div className="flex flex-wrap gap-2">
                {category && (
                  <button onClick={() => setCategory("")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition">
                    {categories.find(c => c.id === category)?.name} ✕
                  </button>
                )}
                {district && (
                  <button onClick={() => setDistrict("")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition">
                    {district} ✕
                  </button>
                )}
                {minRating > 0 && (
                  <button onClick={() => setMinRating(0)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition">
                    {minRating}+ ★ ✕
                  </button>
                )}
                {onlyAvailable && (
                  <button onClick={() => setOnlyAvailable(false)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition">
                    Bo&apos;sh ✕
                  </button>
                )}
              </div>
            </div>

            {/* Master list */}
            {filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map((m) => <MasterRow key={m.id} master={m} />)}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Usta topilmadi</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Qidiruv shartlaringizga mos usta topilmadi. Filtrlarni o&apos;zgartirib qayta urinib ko&apos;ring.
                </p>
                <button onClick={() => { clearFilters(); setQuery(""); setInputVal(""); }}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition">
                  Barcha filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Exported Page (wrapped in Suspense for useSearchParams) ──────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchPageInner />
    </Suspense>
  );
}
