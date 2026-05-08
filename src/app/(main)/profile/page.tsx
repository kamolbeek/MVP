"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";
import {
  categories,
  DISTRICTS,
} from "@/constants";
import {
  reviews,
  getAllMastersWithProfiles,
  getMasterWithProfile,
} from "@/lib/mock/data";

// ── Shared UI ──
function Stars({ r, size = "w-4 h-4" }: { r: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${size} ${s <= Math.round(r) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function relDate(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Bugun";
  if (days < 7) return `${days} kun oldin`;
  if (days < 30) return `${Math.floor(days / 7)} hafta oldin`;
  if (days < 365) return `${Math.floor(days / 30)} oy oldin`;
  return `${Math.floor(days / 365)} yil oldin`;
}

// ── Client Profile ──
function ClientProfile() {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<"reviews" | "saved" | "settings">("reviews");

  const myReviews = useMemo(() => reviews.filter((r) => r.clientId === currentUser?.id), [currentUser]);
  
  // Mock saved masters
  const savedMasters = useMemo(() => {
    const all = getAllMastersWithProfiles();
    return all.slice(0, 3);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-emerald-50">
            <Image src={currentUser.avatar} alt={currentUser.name} width={96} height={96} className="w-full h-full object-cover" unoptimized />
          </div>
          <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium rounded-2xl">
            Rasmni o'zgartirish
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{currentUser.name}</h1>
          <p className="text-slate-500 mt-1">{currentUser.phone}</p>
          <div className="mt-4 flex gap-3 justify-center sm:justify-start">
            <button onClick={() => setActiveTab("settings")} className="px-5 py-2 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
              Profilni tahrirlash
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-100 mb-6">
          {[
            { id: "reviews", label: "Mening sharhlarim" },
            { id: "saved", label: "Saqlangan ustalar" },
            { id: "settings", label: "Sozlamalar" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.id ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Mening sharhlarim</h2>
              {myReviews.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Hali sharh qoldirmagansiz</p>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((r) => {
                    const m = getMasterWithProfile(r.masterId);
                    return (
                      <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                          {m && <Image src={m.avatar} alt={m.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900">{m?.name || "Noma'lum usta"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Stars r={r.rating} />
                            <span className="text-xs text-slate-400">{relDate(r.createdAt)}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Saqlangan ustalar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedMasters.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm relative group">
                    <button className="absolute top-3 right-3 text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 w-8 h-8 rounded-lg flex items-center justify-center transition">
                      ✕
                    </button>
                    <div className="flex gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
                        <Image src={m.avatar} alt={m.name} width={56} height={56} className="w-full h-full object-cover" unoptimized />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Stars r={m.profile.rating} size="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold text-slate-700">{m.profile.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/master/${m.id}`} className="block w-full text-center py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                      Profilni ko'rish
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-xl space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Shaxsiy ma'lumotlar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Ism familiya</label>
                    <input type="text" defaultValue={currentUser.name} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon</label>
                    <input type="text" disabled defaultValue={currentUser.phone} className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed" />
                  </div>
                  <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition">
                    Saqlash
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Parolni o'zgartirish</h3>
                <div className="space-y-4">
                  <input type="password" placeholder="Joriy parol" className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 transition" />
                  <input type="password" placeholder="Yangi parol" className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 transition" />
                  <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                    Parolni yangilash
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-red-100">
                <h3 className="text-lg font-bold text-red-600 mb-2">Xavfli hudud</h3>
                <p className="text-sm text-slate-500 mb-4">Hisobni o'chirish barcha ma'lumotlaringizni yo'q qiladi.</p>
                <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition">
                  Hisobni o'chirish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Master Profile ──
function MasterProfile() {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<"edit" | "portfolio" | "reviews" | "settings">("edit");
  const [isAvailable, setIsAvailable] = useState(true);

  // Note: For a real app, we'd fetch the specific master's profile properly.
  // Here we use a mock one if available, otherwise just mock stats.
  const masterData = useMemo(() => {
    if (!currentUser) return null;
    return getMasterWithProfile(currentUser.id) || {
      profile: { rating: 0, reviewCount: 0, categories: [], location: { district: "" }, experience: 0, bio: "" }
    };
  }, [currentUser]);

  if (!currentUser || !masterData) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full text-center sm:text-left">
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-emerald-50">
                <Image src={currentUser.avatar} alt={currentUser.name} width={112} height={112} className="w-full h-full object-cover" unoptimized />
              </div>
              <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium rounded-2xl">
                O'zgartirish
              </button>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{currentUser.name}</h1>
              <p className="text-emerald-600 font-medium mt-1">{"Mutaxassis"}</p>
              <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg">
                  <Stars r={masterData.profile.rating || 5} size="w-4 h-4" />
                  <span className="text-sm font-bold text-amber-700">{masterData.profile.rating || "5.0"}</span>
                </div>
                <span className="text-sm text-slate-500">{masterData.profile.reviewCount || 0} ta sharh</span>
              </div>
              <div className="mt-5 flex gap-3 justify-center sm:justify-start">
                <Link href={`/master/${currentUser.id}`} className="px-5 py-2.5 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                  Profilni qanday ko'rishadi?
                </Link>
              </div>
            </div>
          </div>

          {/* Right Stats & Status */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 flex-1">
              <p className="text-xs text-slate-500 font-medium mb-2">Ish holati</p>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-12 h-6 rounded-full transition-colors ${isAvailable ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isAvailable ? "translate-x-6" : "translate-x-0"}`} />
                </div>
                <span className={`text-sm font-bold ${isAvailable ? "text-emerald-700" : "text-slate-600"}`}>
                  {isAvailable ? "Hozir bo'sh" : "Band"}
                </span>
              </label>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex-1 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-slate-900">142</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ko'rishlar</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{masterData.profile.reviewCount || 0}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sharhlar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-100 mb-6">
          {[
            { id: "edit", label: "Ma'lumotlarni tahrirlash" },
            { id: "portfolio", label: "Portfolio" },
            { id: "reviews", label: "Sharhlar" },
            { id: "settings", label: "Sozlamalar" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.id ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {activeTab === "edit" && (
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ism familiya</label>
                  <input type="text" defaultValue={currentUser.name} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon raqam</label>
                  <input type="text" disabled defaultValue={currentUser.phone} className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategoriya</label>
                  <select className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 bg-white">
                    {/* Just using mock option for UI */}
                    <option>Santexnik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tuman</label>
                  <select className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 bg-white">
                    <option>Yunusobod</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tajriba (yil)</label>
                  <input type="number" defaultValue={masterData.profile.experience || 5} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">O'zingiz haqida (Bio)</label>
                <textarea rows={4} defaultValue={masterData.profile.bio || ""} className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 resize-none" />
              </div>
              <button className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition shadow-md shadow-emerald-500/20">
                Saqlash
              </button>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Portfolio ishlari</h2>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition">
                  + Yangi qo'shish
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex flex-col justify-end p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-80" />
                    <button className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10">
                      ✕
                    </button>
                    <div className="relative z-10 text-white">
                      <p className="font-bold">Namuna ish #{i}</p>
                      <p className="text-xs text-white/80 mt-0.5">Ta'mirlash xizmati</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Mijozlar sharhlari</h2>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-slate-900">Mijoz Ismi</p>
                      <span className="text-xs text-slate-400">2 kun oldin</span>
                    </div>
                    <Stars r={5} />
                    <p className="mt-2 text-sm text-slate-600">Juda zo'r usta, ishi yoqdi! Tavsiya qilaman.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Bildirishnomalar</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">Yangi buyurtmalar</p>
                    <p className="text-xs text-slate-500">Mijozlardan yangi so'rovlar kelsa xabar berish</p>
                  </div>
                  <div className="relative w-10 h-5 rounded-full bg-emerald-500">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white translate-x-5 transition-transform" />
                  </div>
                </label>
              </div>

              <div className="pt-6 border-t border-red-100 mt-8">
                <h3 className="text-lg font-bold text-red-600 mb-2">Hisobni o'chirish</h3>
                <p className="text-sm text-slate-500 mb-4">Profil va barcha portfoliolaringiz o'chib ketadi.</p>
                <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition">
                  Hisobni o'chirish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ──
export default function ProfilePage() {
  const { currentUser, isLoggedIn } = useStore();
  const router = useRouter();

  if (!isLoggedIn || !currentUser) {
    // Ideally this happens in a useEffect or middleware, but for UI demo we just show a message
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tizimga kirmagansiz</h1>
        <p className="text-slate-500 mb-6">Profilni ko'rish uchun hisobingizga kiring.</p>
        <Link href="/login" className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition">
          Kirish sahifasiga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {currentUser.role === "client" ? <ClientProfile /> : <MasterProfile />}
    </div>
  );
}
