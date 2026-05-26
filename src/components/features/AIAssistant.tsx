"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Master {
  id: string;
  name: string;
  avatar: string;
  profile: {
    rating: number;
    hourlyRate: number;
    isAvailable: boolean;
    location: { district: string };
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

const URGENCY = {
  low:    { label: "Shoshilinch emas", cls: "bg-sky-50 text-sky-600",    dot: "bg-sky-400" },
  medium: { label: "Tez orada",        cls: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  high:   { label: "Tezkor!",          cls: "bg-rose-50 text-rose-500",   dot: "bg-rose-400 animate-pulse" },
} as const;

function getAudioMimeType(): string {
  if (typeof window === "undefined" || !window.MediaRecorder) return "audio/webm";
  const preferred = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const t of preferred) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

const CHIPS = [
  { icon: "🔧", text: "Quvurdan suv oqyapti" },
  { icon: "⚡", text: "Uyda tok o'chib qoldi" },
  { icon: "🪚", text: "Eshik tutqichi buzildi" },
  { icon: "🎨", text: "Devorni bo'yatmoqchiman" },
];

export default function AIAssistant() {
  const [open,          setOpen]          = useState(false);
  const [message,       setMessage]       = useState("");
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState<AIResult | null>(null);
  const [error,         setError]         = useState("");
  const [isRecording,   setIsRecording]   = useState(false);
  const [recSeconds,    setRecSeconds]    = useState(0);
  const [hasMic,        setHasMic]        = useState(false);

  const fileRef      = useRef<HTMLInputElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const mrRef        = useRef<MediaRecorder | null>(null);
  const chunksRef    = useRef<Blob[]>([]);
  const msgRef       = useRef(message); // stable ref for onstop closure
  msgRef.current = message;

  // check mic support
  useEffect(() => {
    setHasMic(
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      !!window.MediaRecorder
    );
  }, []);

  // recording timer
  useEffect(() => {
    if (!isRecording) { setRecSeconds(0); return; }
    const id = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  // auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [message]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open]);

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

  // ── Audio submit ──────────────────────────────────────────────
  const submitAudio = useCallback(async (blob: Blob, mimeType: string) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const buf = await blob.arrayBuffer();
      let bin = "";
      new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
      const audioBase64 = btoa(bin);

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgRef.current.trim() || undefined,
          audioBase64,
          audioMimeType: mimeType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xato yuz berdi");
      setResult(data as AIResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio tahlil qilishda xato");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Toggle recording ──────────────────────────────────────────
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      mrRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getAudioMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        const finalMime = mr.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalMime });
        if (blob.size > 0) submitAudio(blob, finalMime);
      };

      mrRef.current = mr;
      mr.start(250); // collect chunks every 250ms
      setIsRecording(true);
    } catch {
      setError("Mikrofonga ruxsat berilmadi");
    }
  }, [isRecording, submitAudio]);

  // ── Text / image submit ───────────────────────────────────────
  async function handleSubmit() {
    if (loading || (!message.trim() && !imageFile)) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;
      if (imageFile) {
        const buf = await imageFile.arrayBuffer();
        let bin = "";
        new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
        imageBase64 = btoa(bin);
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

  const canSend = !loading && !isRecording && (!!message.trim() || !!imageFile);

  return (
    <>
      {/* ── Floating trigger ─────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="AI Yordamchi"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(145deg, #00D4A0, #00A878)",
          boxShadow: "0 4px 24px rgba(0,200,150,0.4), 0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </span>
      </button>

      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.36)", backdropFilter: "blur(4px)" }}
      />

      {/* ── Sheet ─────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-[400px] flex flex-col bg-white rounded-t-[28px] sm:rounded-tl-[28px] sm:rounded-tr-none transition-transform duration-[340ms] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          height: "min(92svh, 700px)",
          boxShadow: "0 -2px 0 rgba(0,0,0,0.05), 0 -12px 48px rgba(0,0,0,0.14)",
          transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-0.5 shrink-0">
          <div className="w-8 h-[3px] rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[14px] flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(145deg, #00D4A0, #00A878)" }}
            >
              <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-gray-900 leading-tight tracking-[-0.2px]">
                AI Yordamchi
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-none">Usta topishda yordam beradi</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
          >
            <svg className="w-[13px] h-[13px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-gray-100 mx-5 shrink-0" />

        {/* ── Scrollable body ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-14 gap-5 text-center">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-[20px] flex items-center justify-center"
                    style={{ background: "linear-gradient(145deg, #00D4A0, #00A878)" }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="absolute -inset-1.5 rounded-[26px] border-[2.5px] border-emerald-300/60 border-t-emerald-400 animate-spin" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-[15px]">Tahlil qilinmoqda</p>
                  <p className="text-sm text-gray-400 mt-1">AI muammoni o&apos;rganmoqda…</p>
                </div>
              </div>
            )}

            {/* Welcome */}
            {!loading && !result && !error && (
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="w-[68px] h-[68px] rounded-[22px] flex items-center justify-center text-[28px]"
                    style={{
                      background: "linear-gradient(145deg, #edfdf6, #d3faec)",
                      boxShadow: "0 2px 12px rgba(0,200,150,0.12)",
                    }}
                  >
                    🤖
                  </div>
                  <div>
                    <p className="text-[17px] font-semibold text-gray-900 tracking-[-0.3px]">
                      Qanday yordam kerak?
                    </p>
                    <p className="text-[13px] text-gray-400 mt-1.5 leading-relaxed max-w-[240px]">
                      Yozing, gapiring yoki rasm yuboring — AI eng mos ustani topadi
                    </p>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {CHIPS.map(({ icon, text }) => (
                    <button
                      key={text}
                      onClick={() => setMessage(text)}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-left transition-colors group"
                    >
                      <span className="text-[18px] leading-none">{icon}</span>
                      <span className="flex-1 text-[14px] text-gray-700 font-medium">{text}</span>
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && !result && (
              <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                <div className="w-14 h-14 rounded-[18px] bg-rose-50 flex items-center justify-center text-2xl">😕</div>
                <div>
                  <p className="font-semibold text-gray-900">Xato yuz berdi</p>
                  <p className="text-[13px] text-rose-400 mt-1.5 leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[13px] font-medium text-gray-700 transition-colors active:scale-95"
                >
                  Qayta urinish
                </button>
              </div>
            )}

            {/* Result */}
            {!loading && result && (
              <div className="space-y-3">
                {/* Category card */}
                <div
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #edfdf6, #d3faec)" }}
                >
                  <div className="w-11 h-11 rounded-[14px] bg-white/70 flex items-center justify-center text-xl shadow-sm shrink-0">
                    {result.categoryIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-0.5">
                      Aniqlandi
                    </p>
                    <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                      {result.categoryName} kerak
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      URGENCY[result.urgency]?.cls ?? URGENCY.medium.cls
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${URGENCY[result.urgency]?.dot ?? URGENCY.medium.dot}`} />
                    {URGENCY[result.urgency]?.label}
                  </span>
                </div>

                {/* Diagnosis */}
                <div className="rounded-2xl bg-gray-50 p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                      Muammo tahlili
                    </p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{result.diagnosis}</p>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                      Maslahat
                    </p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{result.suggestion}</p>
                  </div>
                </div>

                {/* Masters */}
                {result.masters.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-semibold text-gray-900">Tavsiya etilgan ustalar</p>
                      <Link
                        href={`/search?category=${result.categoryId}`}
                        onClick={() => setOpen(false)}
                        className="text-[12px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Barchasi →
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {result.masters.map((m) => (
                        <Link
                          key={m.id}
                          href={`/master/${m.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-sm active:bg-gray-50 transition-all group"
                        >
                          <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                              <Image
                                src={m.avatar}
                                alt={m.name}
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                m.profile.isAvailable ? "bg-emerald-400" : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-gray-900 truncate">{m.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-amber-400 text-xs leading-none">★</span>
                              <span className="text-[12px] font-medium text-gray-600">
                                {m.profile.rating.toFixed(1)}
                              </span>
                              <span className="text-gray-300 text-xs">·</span>
                              <span className="text-[12px] text-gray-400 truncate">
                                {m.profile.location.district}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[13px] font-semibold text-emerald-600">
                              {(m.profile.hourlyRate / 1000).toFixed(0)}K
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">so&apos;m/soat</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[13px] text-gray-400">
                      Hozir usta mavjud emas.{" "}
                      <Link
                        href="/search"
                        onClick={() => setOpen(false)}
                        className="text-emerald-600 font-medium"
                      >
                        Qidiruv →
                      </Link>
                    </p>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="w-full py-3 rounded-2xl text-[13px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  ← Yangi savol
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Input bar ─────────────────────────────────────────────── */}
        <div className="shrink-0 px-4 pb-6 pt-3 bg-white">
          <div className="h-px bg-gray-100 mb-3" />

          {/* Image preview chip */}
          {imagePreview && !isRecording && (
            <div className="flex items-center gap-2.5 mb-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="preview"
                className="w-10 h-10 rounded-xl object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-gray-700 truncate">
                  {imageFile?.name ?? "Rasm"}
                </p>
                <p className="text-[11px] text-gray-400">Yuborilishga tayyor</p>
              </div>
              <button
                onClick={removeImage}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors active:scale-90"
              >
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Input container */}
          <div
            className={`flex items-end gap-1.5 rounded-2xl px-4 pt-3 pb-2.5 transition-all duration-200 ${
              isRecording
                ? "ring-2 ring-rose-300/80"
                : "bg-gray-100 ring-2 ring-transparent focus-within:bg-white focus-within:ring-emerald-300/60 focus-within:shadow-sm"
            }`}
            style={isRecording ? { background: "linear-gradient(135deg, #fff1f2, #ffe4e6)" } : undefined}
          >
            {/* Recording indicator OR textarea */}
            {isRecording ? (
              <div className="flex-1 flex items-center gap-3 py-1 min-h-[22px]">
                {/* animated waveform dots */}
                <div className="flex items-center gap-[3px]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-rose-400"
                      style={{
                        height: `${8 + ((i * 5) % 12)}px`,
                        animation: `pulse 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[14px] font-medium text-rose-500">
                  Yozilmoqda… {fmtTime(recSeconds)}
                </span>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Muammoni yozing…"
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none leading-[1.45] disabled:opacity-50"
                style={{ minHeight: "22px", maxHeight: "120px" }}
              />
            )}

            {/* Action icons */}
            <div className="flex items-center gap-0.5 pb-0.5 shrink-0">
              {isRecording ? (
                /* Stop button — tap to stop & auto-submit */
                <button
                  type="button"
                  onClick={toggleRecording}
                  aria-label="To'xtatish"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center bg-rose-500 text-white active:scale-90 transition-all"
                  style={{ boxShadow: "0 2px 10px rgba(244,63,94,0.4)" }}
                >
                  <span className="absolute inset-0 rounded-full bg-rose-400/40 animate-ping" />
                  {/* Stop square */}
                  <span className="w-3 h-3 rounded-[3px] bg-white relative" />
                </button>
              ) : (
                <>
                  {/* Mic */}
                  {hasMic && (
                    <button
                      type="button"
                      onClick={toggleRecording}
                      disabled={loading}
                      aria-label="Ovoz yozish"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 transition-all active:scale-90 disabled:opacity-40"
                    >
                      <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M19 10v2a7 7 0 01-14 0v-2M12 19v4m-4 0h8" />
                      </svg>
                    </button>
                  )}

                  {/* Camera */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={loading}
                    aria-label="Rasm tanlash"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 transition-all active:scale-90 disabled:opacity-40"
                  >
                    <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Send */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSend}
                    aria-label="Yuborish"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ml-0.5"
                    style={
                      canSend
                        ? {
                            background: "linear-gradient(145deg, #00D4A0, #00A878)",
                            boxShadow: "0 2px 12px rgba(0,200,150,0.35)",
                          }
                        : { background: "#E5E7EB" }
                    }
                  >
                    {loading ? (
                      <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg
                        className={`w-3.5 h-3.5 ${canSend ? "text-white" : "text-gray-400"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Hint text */}
          {!isRecording && hasMic && !loading && (
            <p className="text-center text-[11px] text-gray-300 mt-2">
              🎤 Mikrofonni bosing va gapiring — AI audio tahlil qiladi
            </p>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
      </div>

      {/* Waveform keyframe animation */}
      <style>{`
        @keyframes pulse {
          from { transform: scaleY(0.4); opacity: 0.6; }
          to   { transform: scaleY(1.2); opacity: 1; }
        }
      `}</style>
    </>
  );
}
