"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Master {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  profile: {
    rating: number;
    reviewCount: number;
    hourlyRate: number;
    isAvailable: boolean;
    location: { district: string };
    experience: number;
  };
}

interface AIResult {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  diagnosis: string;
  suggestion: string;
  urgency: "low" | "medium" | "high";
  masters: Master[];
}

const URGENCY_CONFIG = {
  low:    { label: "Shoshilinch emas", color: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  medium: { label: "Tez orada kerak",  color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  high:   { label: "Tezkor yordam!",   color: "bg-red-100 text-red-700",     dot: "bg-red-500 animate-pulse" },
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      if (imageFile) {
        const buffer = await imageFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        imageBase64 = btoa(binary);
        imageMimeType = imageFile.type;
      }

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), imageBase64, imageMimeType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xato yuz berdi");
      setResult(data as AIResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xizmat vaqtincha ishlamayapti");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #00C896, #00A87E)", boxShadow: "0 4px 20px rgba(0,200,150,0.4)" }}
        title="AI Yordamchi"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v3" />
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse-soft" />
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-[420px] h-[92vh] sm:h-full sm:max-h-[92vh] bg-white sm:rounded-tl-3xl rounded-t-3xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full sm:translate-y-full"}`}
        style={{ boxShadow: "-4px 0 40px rgba(0,0,0,0.15)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-t-3xl sm:rounded-tl-3xl border-b border-gray-100 shrink-0"
          style={{ background: "linear-gradient(135deg, #0B1120, #0F1D2F)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00C896, #00A87E)" }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v3" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">AI Yordamchi</h2>
              <p className="text-gray-400 text-xs">Muammoni tasvirlab bering</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Input form — always visible until result */}
          {!result && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-[#0A0A0A] mb-2">
                  Muammoni tasvirlang
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Masalan: Vannaxonamda quvurdan suv oqyapti, devor nam bo'lyapti…"
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition placeholder:text-gray-300"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-bold text-[#0A0A0A] mb-2">
                  Rasm yuklash <span className="font-normal text-gray-400">(ixtiyoriy)</span>
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="preview" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xs transition"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-brand-500 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium">Rasm tanlash (JPG, PNG)</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!message.trim() && !imageFile)}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #00C896, #00A87E)", boxShadow: "0 4px 14px rgba(0,200,150,0.25)" }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Tahlil qilinmoqda…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tahlil qilish
                  </>
                )}
              </button>
            </form>
          )}

          {/* AI Result */}
          {result && (
            <div className="space-y-4 animate-slide-up">
              {/* Category badge */}
              <div className="flex items-center gap-2 p-3.5 bg-brand-50 border border-brand-100 rounded-2xl">
                <span className="text-2xl">{result.categoryIcon}</span>
                <div>
                  <p className="text-xs text-brand-600 font-semibold uppercase tracking-wide">Aniqlandi</p>
                  <p className="text-base font-bold text-[#0A0A0A]">{result.categoryName} kerak</p>
                </div>
                <span className={`ml-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${URGENCY_CONFIG[result.urgency as keyof typeof URGENCY_CONFIG]?.color ?? URGENCY_CONFIG.medium.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${URGENCY_CONFIG[result.urgency as keyof typeof URGENCY_CONFIG]?.dot ?? URGENCY_CONFIG.medium.dot}`} />
                  {URGENCY_CONFIG[result.urgency as keyof typeof URGENCY_CONFIG]?.label ?? ""}
                </span>
              </div>

              {/* Diagnosis */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">Muammo tahlili</p>
                <p className="text-sm text-[#374151] leading-relaxed">{result.diagnosis}</p>
                <p className="text-sm text-[#374151] leading-relaxed border-t border-gray-200 pt-2 mt-2">{result.suggestion}</p>
              </div>

              {/* Matched masters */}
              {result.masters.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A] mb-3">
                    Tavsiya etilgan ustalar ({result.masters.length} ta)
                  </p>
                  <div className="space-y-2.5">
                    {result.masters.map((m) => (
                      <Link
                        key={m.id}
                        href={`/master/${m.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-brand-200 hover:shadow-sm transition-all group"
                      >
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <Image src={m.avatar} alt={m.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${m.profile.isAvailable ? "bg-emerald-500" : "bg-gray-300"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0A0A0A] truncate">{m.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-amber-400 text-xs">★</span>
                            <span className="text-xs font-semibold text-[#374151]">{m.profile.rating.toFixed(1)}</span>
                            <span className="text-xs text-[#9CA3AF]">·</span>
                            <span className="text-xs text-[#6B7280] truncate">{m.profile.location.district}</span>
                          </div>
                          <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                            {m.profile.hourlyRate.toLocaleString("uz-UZ")} so&apos;m/soat
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {result.masters.length === 0 && (
                <div className="text-center py-4 text-sm text-[#6B7280]">
                  Bu kategoriyada hozir usta mavjud emas.{" "}
                  <Link href="/search" onClick={() => setOpen(false)} className="text-brand-600 font-semibold">
                    Qidiruvga o&apos;ting →
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={reset}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-[#374151] hover:bg-gray-50 transition"
                >
                  Yangi savol
                </button>
                <Link
                  href={`/search?category=${result.categoryId}`}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white text-center transition active:scale-[0.97]"
                  style={{ background: "linear-gradient(135deg, #00C896, #00A87E)" }}
                >
                  Hammasini ko&apos;rish →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
