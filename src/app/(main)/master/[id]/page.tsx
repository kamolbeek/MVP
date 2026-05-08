"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  getMasterWithProfile,
  getReviewsByMaster,
  categories,
  getAllMastersWithProfiles,
} from "@/lib/mock/data";

// ── Stars ──────────────────────────────────────────────────────────────────────
function Stars({ r, size = "w-4 h-4" }: { r: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`${size} ${s<=Math.round(r)?"text-amber-400":"text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

// ── Relative date ──────────────────────────────────────────────────────────────
function relDate(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Bugun";
  if (days < 7) return `${days} kun oldin`;
  if (days < 30) return `${Math.floor(days/7)} hafta oldin`;
  if (days < 365) return `${Math.floor(days/30)} oy oldin`;
  return `${Math.floor(days/365)} yil oldin`;
}

// ── Portfolio placeholder cards ────────────────────────────────────────────────
const PORTFOLIO_ITEMS = [
  { title: "Vannaxona ta'miri", color: "from-blue-400 to-cyan-500" },
  { title: "Quvur almashtirish", color: "from-emerald-400 to-teal-500" },
  { title: "Kran o'rnatish", color: "from-violet-400 to-purple-500" },
  { title: "Chiqindi tizimi", color: "from-orange-400 to-amber-500" },
  { title: "Bojxona ishi", color: "from-rose-400 to-pink-500" },
  { title: "Issiqlik tizimi", color: "from-slate-400 to-slate-600" },
];

// ── Contact Modal ──────────────────────────────────────────────────────────────
function ContactModal({ master, onClose }: { master: ReturnType<typeof getMasterWithProfile>; onClose: () => void }) {
  if (!master) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition">✕</button>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 mx-auto mb-4 ring-4 ring-emerald-100">
            <Image src={master.avatar} alt={master.name} width={80} height={80} className="w-full h-full object-cover" unoptimized />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{master.name}</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Bog'lanish uchun quyidagi raqamga qo'ng'iroq qiling</p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-5">
            <p className="text-xs text-slate-400 mb-1">Telefon raqam</p>
            <p className="text-xl font-bold text-slate-900 tracking-wide">{master.phone}</p>
          </div>
          <a href={`tel:${master.phone}`} className="block w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition text-sm mb-3">
            📞 Qo'ng'iroq qilish
          </a>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Yopish</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function MasterPage() {
  const { id } = useParams<{ id: string }>();
  const master = getMasterWithProfile(id);
  const reviews = getReviewsByMaster(id);
  const [showModal, setShowModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const similar = useMemo(() => {
    if (!master) return [];
    const catId = master.profile.categories[0];
    return getAllMastersWithProfiles()
      .filter((m) => m.id !== master.id && m.profile.categories.includes(catId))
      .slice(0, 3);
  }, [master]);

  if (!master) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Usta topilmadi</h1>
        <p className="text-slate-500 mb-6">Bu sahifa mavjud emas yoki usta o'chirilgan.</p>
        <Link href="/search" className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition">
          Qidirishga qaytish
        </Link>
      </div>
    );
  }

  const { profile } = master;
  const cat = categories.find((c) => c.id === profile.categories[0]);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  // Rating breakdown (mock distribution)
  const breakdown = [
    { stars: 5, pct: 78 }, { stars: 4, pct: 14 },
    { stars: 3, pct: 5 },  { stars: 2, pct: 2 }, { stars: 1, pct: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {showModal && <ContactModal master={master} onClose={() => setShowModal(false)} />}

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 pt-8 pb-24 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Orqaga
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white/10 ring-4 ring-white/20">
                <Image src={master.avatar} alt={master.name} width={112} height={112} className="w-full h-full object-cover" unoptimized />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${profile.isAvailable ? "bg-emerald-500" : "bg-slate-400"}`} />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{master.name}</h1>
                <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold" title="Tasdiqlangan usta">✓</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.isAvailable ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}>
                  {profile.isAvailable ? "Hozir bo'sh" : "Band"}
                </span>
              </div>

              {cat && <p className="text-emerald-400 font-medium mt-1">{cat.icon} {cat.name}</p>}
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {profile.location.district}, Toshkent
              </p>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Stars r={profile.rating} size="w-5 h-5" />
                  <span className="text-white font-bold">{profile.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-sm">({profile.reviewCount} ta sharh)</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 text-sm">📅 {profile.experience} yil tajriba</span>
              </div>

              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <button onClick={() => setShowModal(true)}
                  className="px-7 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] text-sm">
                  📞 Bog'lanish
                </button>
                <button onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-7 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition text-sm">
                  ✍️ Sharh qoldirish
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none"><path d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z" fill="#f8fafc"/></svg>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">📝 Usta haqida</h2>
              <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {cat && (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium">{cat.icon} {cat.name}</span>
                )}
                <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-medium">🏆 Top usta</span>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-medium">✓ Tasdiqlangan</span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium">📍 {profile.location.district}</span>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">🖼️ Ishlar namunasi</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PORTFOLIO_ITEMS.map((item, i) => (
                  <div key={i} className={`aspect-video rounded-xl bg-gradient-to-br ${item.color} flex items-end p-3 cursor-pointer hover:scale-[1.02] transition-transform`}>
                    <span className="text-white text-xs font-medium drop-shadow">{item.title}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition">
                Barcha ishlarni ko'rish →
              </button>
            </div>

            {/* Review form */}
            {showReviewForm && (
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">✍️ Sharh qoldirish</h3>
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Baho</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} onClick={() => setNewReview(p => ({...p, rating: s}))}
                        className={`text-3xl transition-transform hover:scale-110 ${s<=newReview.rating ? "text-amber-400" : "text-slate-200"}`}>★</button>
                    ))}
                  </div>
                </div>
                <textarea value={newReview.comment} onChange={(e) => setNewReview(p => ({...p, comment: e.target.value}))}
                  placeholder="Usta haqida fikringizni yozing..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none" />
                <div className="flex gap-3 mt-3">
                  <button onClick={() => { setShowReviewForm(false); setNewReview({ rating: 5, comment: "" }); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Bekor qilish</button>
                  <button onClick={() => { setShowReviewForm(false); alert("Sharh qabul qilindi! (Mock)"); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition">Yuborish</button>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5">💬 Mijozlar sharhlari</h2>

              {/* Rating breakdown */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-slate-100">
                <div className="text-center shrink-0">
                  <div className="text-5xl font-extrabold text-slate-900">{profile.rating.toFixed(1)}</div>
                  <Stars r={profile.rating} size="w-5 h-5" />
                  <p className="text-xs text-slate-400 mt-1">{profile.reviewCount} ta sharh</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {breakdown.map(({ stars, pct }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-4 text-right">{stars}</span>
                      <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-8">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review cards */}
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm">Hali sharhlar yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleReviews.map((rev) => (
                    <div key={rev.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <Image src={rev.clientAvatar} alt={rev.clientName} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-medium text-sm text-slate-900">{rev.clientName}</span>
                          <span className="text-xs text-slate-400">{relDate(rev.createdAt)}</span>
                        </div>
                        <Stars r={rev.rating} size="w-3.5 h-3.5" />
                        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    </div>
                  ))}
                  {reviews.length > 5 && (
                    <button onClick={() => setShowAllReviews(!showAllReviews)}
                      className="w-full py-3 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                      {showAllReviews ? "Kamroq ko'rsatish" : `Ko'proq ko'rish (${reviews.length - 5} ta)`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-4">📊 Statistika</h3>
              <div className="space-y-3">
                {[
                  { label: "Umumiy reyting", val: `${profile.rating.toFixed(1)} / 5`, color: "text-amber-500" },
                  { label: "Jami sharhlar", val: `${profile.reviewCount} ta`, color: "text-emerald-600" },
                  { label: "Tajriba", val: `${profile.experience} yil`, color: "text-blue-600" },
                  { label: "Holati", val: profile.isAvailable ? "Bo'sh" : "Band", color: profile.isAvailable ? "text-emerald-600" : "text-slate-500" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{s.label}</span>
                    <span className={`text-sm font-semibold ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <h3 className="font-semibold mb-1">Bog'lanishga tayyor!</h3>
              <p className="text-emerald-100 text-sm mb-4">Usta hozir {profile.isAvailable ? "bo'sh" : "band"} va so'rovlarni qabul qiladi.</p>
              <button onClick={() => setShowModal(true)}
                className="w-full py-3 rounded-xl font-semibold text-emerald-700 bg-white hover:bg-emerald-50 transition text-sm">
                📞 Bog'lanish
              </button>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 mb-3">📍 Joylashuv</h3>
              <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.1) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-1">📍</div>
                  <p className="text-xs font-medium text-slate-600">{profile.location.district}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">{profile.location.address}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.location.city}, O'zbekiston</p>
            </div>

            {/* Similar Masters */}
            {similar.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 mb-4">👥 O'xshash ustalar</h3>
                <div className="space-y-3">
                  {similar.map((m) => {
                    const sCat = categories.find((c) => c.id === m.profile.categories[0]);
                    return (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                          <Image src={m.avatar} alt={m.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{m.name}</p>
                          <p className="text-xs text-slate-500">{sCat?.icon} {sCat?.name} • ⭐ {m.profile.rating}</p>
                        </div>
                        <Link href={`/master/${m.id}`}
                          className="shrink-0 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition">
                          Ko'rish →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
