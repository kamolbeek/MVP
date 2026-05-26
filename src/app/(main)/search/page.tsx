"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, getAllMastersWithProfiles } from "@/lib/mock/data";
import { REGIONS } from "@/constants";
import { MasterWithProfile } from "@/types";

/* ── Stars ── */
function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "cat-1": { bg: "bg-blue-50", text: "text-blue-700" },
  "cat-2": { bg: "bg-amber-50", text: "text-amber-700" },
  "cat-3": { bg: "bg-orange-50", text: "text-orange-700" },
  "cat-4": { bg: "bg-violet-50", text: "text-violet-700" },
  "cat-5": { bg: "bg-rose-50", text: "text-rose-700" },
  "cat-6": { bg: "bg-pink-50", text: "text-pink-700" },
  "cat-7": { bg: "bg-teal-50", text: "text-teal-700" },
  "cat-8": { bg: "bg-red-50", text: "text-red-700" },
  "cat-9": { bg: "bg-indigo-50", text: "text-indigo-700" },
  "cat-10": { bg: "bg-emerald-50", text: "text-emerald-700" },
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange(value === s ? 0 : s)}
          onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${s <= (hovered || value) ? "bg-amber-50 text-amber-400 scale-110" : "bg-gray-50 text-gray-300 hover:bg-gray-100"}`}>
          ★
        </button>
      ))}
      {value > 0 && <span className="text-xs text-[#6B7280] self-center ml-1 font-medium">{value}+ yulduz</span>}
    </div>
  );
}

function fmtPrice(n: number) {
  return n.toLocaleString("uz-UZ") + " so'm";
}

/* ════════════════════════════════════════════════════════════════════════════
   Reverse-geocoding helpers (Nominatim / OpenStreetMap)
   ════════════════════════════════════════════════════════════════════════════ */
interface GeoAddress {
  state?: string; state_district?: string; county?: string;
  suburb?: string; city_district?: string; quarter?: string;
  city?: string; town?: string; village?: string;
  [k: string]: string | undefined;
}

function normalizeGeo(s: string): string {
  return s.toLowerCase()
    .replace(/[''ʻʼ`]/g, "'")
    .replace(/viloyati?|oblast|region|province|republic|respublika|shahri?|city/gi, "")
    .replace(/tumani?|district|rayon/gi, "")
    .replace(/\s+/g, " ").trim();
}

const REGION_PATTERNS: [RegExp, string][] = [
  [/tashkent\s*city|toshkent\s*shahri|toshkent\s*sh\b|tashkent\s*sh\b/, "Toshkent shahri"],
  [/tashkent|toshkent/, "Toshkent viloyati"],
  [/samarqand|samarkand/, "Samarqand viloyati"],
  [/farg[`'']?ona|fergana|farghona/, "Farg'ona viloyati"],
  [/andijon|andijan/, "Andijon viloyati"],
  [/namangan/, "Namangan viloyati"],
  [/buxoro|bukhara/, "Buxoro viloyati"],
  [/xorazm|khorezm/, "Xorazm viloyati"],
  [/qashqadaryo|kashkadarya|qashkadarya/, "Qashqadaryo viloyati"],
  [/surxondaryo|surkhandarya/, "Surxondaryo viloyati"],
  [/jizzax|jizzakh|djizzak/, "Jizzax viloyati"],
  [/sirdaryo|syrdarya/, "Sirdaryo viloyati"],
  [/navoiy|navoi/, "Navoiy viloyati"],
  [/qoraqalpog|karakalpak/, "Qoraqalpog'iston Respublikasi"],
];

function geocodeToRegion(addr: GeoAddress): string {
  const state = (addr.state || "").toLowerCase();
  for (const [pat, name] of REGION_PATTERNS) {
    if (pat.test(state)) return name;
  }
  return "";
}

function geocodeToDistrict(addr: GeoAddress, regionName: string): string {
  const region = REGIONS.find(r => r.name === regionName);
  if (!region) return "";
  const candidates = [
    addr.suburb, addr.city_district, addr.quarter,
    addr.state_district, addr.county, addr.town, addr.village, addr.city,
  ].filter(Boolean) as string[];
  for (const district of region.districts) {
    const dn = normalizeGeo(district);
    if (candidates.some(c => { const cn = normalizeGeo(c); return cn.includes(dn) || dn.includes(cn); })) {
      return district;
    }
  }
  return "";
}

/* ── MasterRow card ── */
function MasterRow({ master }: { master: MasterWithProfile }) {
  const { profile } = master;
  const cat = categories.find(c => c.id === profile.categories[0]);
  const catColor = CAT_COLORS[profile.categories[0]] || CAT_COLORS["cat-1"];
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 transition-all duration-300 p-5 relative overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)", borderLeft: `3px solid ${profile.isAvailable ? "#00C896" : "#D1D5DB"}` }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)"; }}>
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-100 ring-[3px] ring-gray-50">
            <Image src={master.avatar} alt={master.name} width={72} height={72} className="w-full h-full object-cover" unoptimized />
          </div>
          <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-[2.5px] border-white ${profile.isAvailable ? "bg-emerald-500" : "bg-gray-300"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-[#0A0A0A] truncate">{master.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {cat && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>
                    {cat.icon} {cat.name}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-[#374151]">
                  <svg className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  {profile.location.district}
                </span>
                <span className="text-sm text-[#374151]">· {profile.experience} yil</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${profile.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${profile.isAvailable ? "bg-emerald-500" : "bg-gray-400"}`} />
                {profile.isAvailable ? "Bo'sh" : "Band"}
              </span>
              <span className="text-sm font-bold text-brand-600">
                {fmtPrice(profile.hourlyRate)}<span className="text-xs font-normal text-[#6B7280]">/soat</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <Stars rating={profile.rating} />
            <span className="text-sm font-bold text-[#0A0A0A]">{profile.rating.toFixed(1)}</span>
            <span className="text-xs text-[#6B7280]">({profile.reviewCount} ta sharh)</span>
          </div>
          <p className="mt-2 text-sm text-[#4B5563] line-clamp-2 leading-relaxed">{profile.bio}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link href={`/master/${master.id}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white transition-all duration-200 active:scale-[0.97]">
          Profilni ko&apos;rish →
        </Link>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Search Page Inner
   ════════════════════════════════════════════════════════════════════════════ */
function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputVal, setInputVal] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [minRating, setMinRating] = useState(Number(searchParams.get("rating") || 0));
  const [priceMin, setPriceMin] = useState<number|"">(searchParams.get("pmin") ? Number(searchParams.get("pmin")) : "");
  const [priceMax, setPriceMax] = useState<number|"">(searchParams.get("pmax") ? Number(searchParams.get("pmax")) : "");
  const [onlyAvailable, setOnlyAvailable] = useState(searchParams.get("available") === "1");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating");
  const [showFilters, setShowFilters] = useState(false);

  /* ── GPS location state ── */
  const [locating, setLocating] = useState(false);
  const [locLabel, setLocLabel] = useState(""); // detected location label
  const [locError, setLocError] = useState("");

  const allMasters = useMemo(() => getAllMastersWithProfiles(), []);

  const regionDistricts = useMemo(() => {
    if (!region) return [];
    return REGIONS.find(r => r.name === region)?.districts ?? [];
  }, [region]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (region) params.set("region", region);
    if (district) params.set("district", district);
    if (minRating) params.set("rating", String(minRating));
    if (priceMin !== "") params.set("pmin", String(priceMin));
    if (priceMax !== "") params.set("pmax", String(priceMax));
    if (onlyAvailable) params.set("available", "1");
    if (sortBy !== "rating") params.set("sort", sortBy);
    router.replace(`/search${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
  }, [query, category, region, district, minRating, priceMin, priceMax, onlyAvailable, sortBy, router]);

  /* ── GPS detect ── */
  async function detectLocation() {
    if (!("geolocation" in navigator)) {
      setLocError("Brauzer GPS ni qo'llab-quvvatlamaydi");
      return;
    }
    setLocating(true);
    setLocLabel("");
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10&addressdetails=1`,
            { headers: { "Accept-Language": "uz,en;q=0.9", "User-Agent": "USTAM-app/1.0" } }
          );
          if (!res.ok) throw new Error("API error");
          const data = await res.json();
          const addr: GeoAddress = data.address || {};

          const detectedRegion = geocodeToRegion(addr);
          if (detectedRegion) {
            setRegion(detectedRegion);
            setDistrict("");
            const detectedDistrict = geocodeToDistrict(addr, detectedRegion);
            if (detectedDistrict) setDistrict(detectedDistrict);
            setLocLabel(detectedDistrict ? `${detectedDistrict}, ${detectedRegion}` : detectedRegion);
          } else {
            setLocError("Joylashuv O'zbekiston ichida aniqlanmadi");
          }
        } catch {
          setLocError("Tarmoq xatosi. Qayta urinib ko'ring.");
        } finally {
          setLocating(false);
        }
      },
      err => {
        setLocating(false);
        setLocError(
          err.code === 1 ? "GPS ruxsat berilmadi. Brauzer sozlamalarini tekshiring." :
          err.code === 2 ? "Joylashuv signali topilmadi." :
          "Vaqt tugadi. Qayta urinib ko'ring."
        );
      },
      { timeout: 12000, maximumAge: 300000, enableHighAccuracy: false }
    );
  }

  function clearLocation() {
    setLocLabel("");
    setLocError("");
    setRegion("");
    setDistrict("");
  }

  /* ── Filtering + sorting ── */
  const filtered = useMemo(() => {
    const res = allMasters.filter(m => {
      const { profile } = m;
      if (query) {
        const q = query.toLowerCase();
        const catName = categories.find(c => c.id === profile.categories[0])?.name.toLowerCase() || "";
        if (!m.name.toLowerCase().includes(q) && !profile.bio.toLowerCase().includes(q) && !catName.includes(q)) return false;
      }
      if (category && !profile.categories.includes(category)) return false;
      if (region && profile.location.region !== region) return false;
      if (district && profile.location.district !== district) return false;
      if (minRating && profile.rating < minRating) return false;
      if (priceMin !== "" && profile.hourlyRate < Number(priceMin)) return false;
      if (priceMax !== "" && profile.hourlyRate > Number(priceMax)) return false;
      if (onlyAvailable && !profile.isAvailable) return false;
      return true;
    });
    return [...res].sort((a, b) => {
      if (sortBy === "reviews") return b.profile.reviewCount - a.profile.reviewCount;
      if (sortBy === "price-asc") return a.profile.hourlyRate - b.profile.hourlyRate;
      if (sortBy === "price-desc") return b.profile.hourlyRate - a.profile.hourlyRate;
      if (sortBy === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.profile.rating - a.profile.rating;
    });
  }, [allMasters, query, category, region, district, minRating, priceMin, priceMax, onlyAvailable, sortBy]);

  const hasFilters = !!(category || region || district || minRating || priceMin !== "" || priceMax !== "" || onlyAvailable);

  function clearFilters() {
    setCategory(""); setRegion(""); setDistrict(""); setMinRating(0);
    setPriceMin(""); setPriceMax(""); setOnlyAvailable(false);
    setLocLabel(""); setLocError("");
  }

  /* ─────────────────────────────────────────────────────────────
     Filter Panel
     ───────────────────────────────────────────────────────────── */
  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#0A0A0A]">Filtrlar</h3>
        {hasFilters && <button onClick={clearFilters} className="text-xs text-brand-600 hover:underline font-semibold">Tozalash</button>}
      </div>

      {/* ── GPS Location detector ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Joylashuvim</label>

        {/* Success state */}
        {locLabel && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 mb-2">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            <span className="text-xs font-semibold text-emerald-700 flex-1 truncate">{locLabel}</span>
            <button onClick={clearLocation} className="text-emerald-400 hover:text-emerald-600 shrink-0 text-sm leading-none">✕</button>
          </div>
        )}

        {/* Error state */}
        {locError && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 mb-2">
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span className="text-xs text-red-600 leading-snug">{locError}</span>
          </div>
        )}

        {/* Detect button */}
        {!locLabel && (
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-brand-300 text-brand-600 text-sm font-semibold hover:bg-brand-50 hover:border-brand-400 transition-all disabled:opacity-60 disabled:cursor-wait"
          >
            {locating ? (
              <>
                <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Aniqlanmoqda...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Joylashuvingizni aniqlash
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Category ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Kategoriya</label>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all">
          <option value="">Barchasi</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* ── Region (viloyat) — cascade step 1 ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Viloyat</label>
        <select value={region} onChange={e => { setRegion(e.target.value); setDistrict(""); setLocLabel(""); }}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          size={1}
          style={{ maxHeight: "none" }}>
          <option value="">Barchasi</option>
          {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
        </select>
      </div>

      {/* ── District (tuman) — cascade step 2 ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">
          Tuman
          {!region && <span className="text-xs font-normal text-[#9CA3AF] ml-1">(avval viloyat tanlang)</span>}
        </label>
        <select value={district} onChange={e => setDistrict(e.target.value)}
          disabled={!region}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          size={1}>
          <option value="">{region ? "Barchasi" : "—"}</option>
          {regionDistricts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {region && regionDistricts.length > 8 && (
          <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">{regionDistricts.length} ta tuman — pastga aylantiring ↓</p>
        )}
      </div>

      {/* ── Price range ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Narx oraligi (so&apos;m/soat)</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Dan" value={priceMin} min={0}
            onChange={e => setPriceMin(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all" />
          <input type="number" placeholder="Gacha" value={priceMax} min={0}
            onChange={e => setPriceMax(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all" />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { label: "≤100K", min: "" as const, max: 100000 },
            { label: "100–200K", min: 100000, max: 200000 },
            { label: "200K+", min: 200000, max: "" as const },
          ].map(opt => (
            <button key={opt.label} type="button"
              onClick={() => { setPriceMin(opt.min); setPriceMax(opt.max); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                priceMin === opt.min && priceMax === opt.max
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-[#6B7280] hover:border-gray-300 hover:bg-gray-50"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Minimum rating ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Minimal reyting</label>
        <StarPicker value={minRating} onChange={setMinRating} />
      </div>

      {/* ── Available toggle ── */}
      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="relative">
          <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-brand-500 transition-colors duration-200" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 peer-checked:translate-x-5" />
        </div>
        <span className="text-sm font-medium text-[#374151]">Faqat bo&apos;sh ustalar</span>
      </label>

      {/* ── Sort ── */}
      <div>
        <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Saralash</label>
        <div className="space-y-2">
          {[
            { val: "rating", label: "⭐ Reyting bo'yicha" },
            { val: "reviews", label: "💬 Sharh soni bo'yicha" },
            { val: "price-asc", label: "💰 Narx (arzon avval)" },
            { val: "price-desc", label: "💎 Narx (qimmat avval)" },
            { val: "new", label: "🆕 Yangi" },
          ].map(opt => (
            <button key={opt.val} onClick={() => setSortBy(opt.val)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                sortBy === opt.val
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-100 text-[#374151] hover:bg-gray-50 hover:border-gray-200"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden pt-10 pb-14" style={{ background: "linear-gradient(135deg, #0B1120, #0F1D2F, #0A3D2E)" }}>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Usta qidirish</h1>
          <p className="text-gray-400 mb-8 text-base">Barcha soha bo&apos;yicha tajribali ustalarni toping</p>

          <form onSubmit={e => { e.preventDefault(); setQuery(inputVal); }} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={inputVal} onChange={e => { setInputVal(e.target.value); setQuery(e.target.value); }}
                placeholder="Usta ismi yoki kasbi bo'yicha..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.08] backdrop-blur-md text-white placeholder:text-gray-400 border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all text-sm" />
            </div>
            <button type="submit" className="h-14 px-7 rounded-2xl font-semibold text-white text-sm whitespace-nowrap transition-all duration-200 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #00C896, #00A87E)", boxShadow: "0 4px 14px rgba(0,200,150,0.25)" }}>
              Qidirish
            </button>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 32" fill="none"><path d="M0 32 C360 0 1080 0 1440 32 L1440 32 L0 32 Z" fill="#F8FAFB"/></svg></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Mobile filter toggle ── */}
        <div className="lg:hidden mb-5">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-[#0A0A0A] transition-all hover:border-brand-300"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            Filtrlar
            {hasFilters && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
            {locLabel && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
          </button>

          {/* Mobile filter panel — scrollable, max 80vh */}
          {showFilters && (
            <div className="mt-3 bg-white rounded-2xl border border-gray-100 animate-slide-down overflow-hidden"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)", maxHeight: "80vh" }}>
              <div className="overflow-y-auto p-6" style={{ maxHeight: "80vh" }}>
                <FilterPanel />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* ── Desktop Sidebar — sticky, scrollable ── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 sticky top-24 overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", maxHeight: "calc(100vh - 7rem)" }}>
              <div className="overflow-y-auto p-6 h-full">
                <FilterPanel />
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-base text-[#6B7280]">
                <span className="text-xl font-extrabold text-[#0A0A0A]">{filtered.length}</span> ta usta topildi
              </p>
              <div className="flex flex-wrap gap-2">
                {category && (
                  <button onClick={() => setCategory("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition">
                    {categories.find(c => c.id === category)?.name} ✕
                  </button>
                )}
                {region && (
                  <button onClick={() => { setRegion(""); setDistrict(""); setLocLabel(""); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition">
                    📍 {region} ✕
                  </button>
                )}
                {district && (
                  <button onClick={() => setDistrict("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition">
                    {district} ✕
                  </button>
                )}
                {minRating > 0 && (
                  <button onClick={() => setMinRating(0)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition">
                    {minRating}+ ★ ✕
                  </button>
                )}
                {(priceMin !== "" || priceMax !== "") && (
                  <button onClick={() => { setPriceMin(""); setPriceMax(""); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition">
                    💰 Narx filtri ✕
                  </button>
                )}
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-4 animate-stagger">
                {filtered.map(m => <MasterRow key={m.id} master={m} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Usta topilmadi</h3>
                <p className="text-[#6B7280] text-sm max-w-sm mx-auto mb-6">
                  Qidiruv shartlaringizga mos usta topilmadi. Filtrlarni o&apos;zgartirib qayta urinib ko&apos;ring.
                </p>
                <button onClick={() => { clearFilters(); setQuery(""); setInputVal(""); }}
                  className="btn-primary text-sm">Barcha filtrlarni tozalash</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFB" }}>
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
