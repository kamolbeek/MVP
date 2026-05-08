"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";
import { categories } from "@/lib/mock/data";
import { DISTRICTS } from "@/constants";

type Role = "client" | "master";
type Step = 1 | 2;

export default function RegisterPage() {
  const router = useRouter();
  const register = useStore((s) => s.register);

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", password: "", confirm: "",
    category: "", district: "", bio: "", experience: "",
  });

  function set_(field: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  function formatPhone(val: string) {
    const d = val.replace(/\D/g, "");
    if (d.startsWith("998")) {
      const n = d.slice(3, 12);
      let out = "+998";
      if (n.length > 0) out += " " + n.slice(0, 2);
      if (n.length > 2) out += " " + n.slice(2, 5);
      if (n.length > 5) out += " " + n.slice(5, 7);
      if (n.length > 7) out += " " + n.slice(7, 9);
      return out;
    }
    return val;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Ism familiyangizni kiriting");
    if (!form.phone.trim()) return setError("Telefon raqam kiriting");
    if (form.password.length < 6) return setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
    if (form.password !== form.confirm) return setError("Parollar mos kelmadi");
    if (role === "master" && !form.category) return setError("Kategoriya tanlang");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const rawPhone = "+" + form.phone.replace(/\D/g, "");
    const result = register({ name: form.name, phone: rawPhone, role, email: "" });
    setLoading(false);
    if (result.success) router.push("/home");
    else setError(result.error || "Xatolik yuz berdi");
  }

  // ── Step 1: Role selection ────────────────────────────────────────────────
  const roles = [
    { val: "client" as Role, icon: "👤", title: "Mijoz", desc: "Usta qidiraman", color: "emerald" },
    { val: "master" as Role, icon: "🔧", title: "Usta", desc: "Ish qidiraman", color: "teal" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/25 mb-3">X</div>
            <h1 className="text-2xl font-bold text-slate-900">Yangi hisob yaratish</h1>
            <p className="text-slate-500 text-sm mt-1">
              {step === 1 ? "Rolni tanlang" : "Ma'lumotlaringizni kiriting"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {[1, 2].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-slate-100"}`} />
            ))}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-7">
                {roles.map((r) => (
                  <button key={r.val} type="button" onClick={() => setRole(r.val)}
                    className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                      role === r.val
                        ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}>
                    {role === r.val && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                    )}
                    <span className="text-4xl">{r.icon}</span>
                    <div className="text-center">
                      <p className={`font-bold text-base ${role === r.val ? "text-emerald-700" : "text-slate-900"}`}>{r.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)}
                className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]">
                Davom etish →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {error}
                </div>
              )}

              {/* Role badge */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                <span className="text-lg">{role === "client" ? "👤" : "🔧"}</span>
                <span className="text-sm font-medium text-emerald-700">{role === "client" ? "Mijoz" : "Usta"} sifatida ro'yxatdan o'tyapsiz</span>
                <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-emerald-600 hover:underline">O'zgartirish</button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ism familiya</label>
                <input value={form.name} onChange={(e) => set_("name", e.target.value)}
                  placeholder="Sardor Rahimov"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon raqam</label>
                <input value={form.phone} onChange={(e) => set_("phone", formatPhone(e.target.value))}
                  placeholder="+998 90 123 45 67" type="tel"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Parol</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => set_("password", e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">{showPwd ? "🙈" : "👁️"}</button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Parolni tasdiqlang</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={(e) => set_("confirm", e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">{showConfirm ? "🙈" : "👁️"}</button>
                </div>
              </div>

              {/* Master-only fields */}
              {role === "master" && (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex-1 h-px bg-slate-100" />Usta ma'lumotlari<div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategoriya</label>
                    <select value={form.category} onChange={(e) => set_("category", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition bg-white">
                      <option value="">Kategoriya tanlang</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tuman</label>
                    <select value={form.district} onChange={(e) => set_("district", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition bg-white">
                      <option value="">Tuman tanlang</option>
                      {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tajriba (yil)</label>
                    <input type="number" min="0" max="50" value={form.experience} onChange={(e) => set_("experience", e.target.value)}
                      placeholder="5"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">O'zingiz haqida</label>
                    <textarea value={form.bio} onChange={(e) => set_("bio", e.target.value)}
                      placeholder="Tajribangiz, ko'nikmalaringiz haqida yozing..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none placeholder:text-slate-300" />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="px-5 h-12 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                  ← Orqaga
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Yuklanmoqda...</>
                  ) : "Ro'yxatdan o'tish"}
                </button>
              </div>
            </form>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
              Kirish
            </Link>
          </p>
        </div>

        <div className="text-center mt-5">
          <Link href="/home" className="text-sm text-slate-400 hover:text-slate-600 transition">← Bosh sahifaga qaytish</Link>
        </div>
      </div>
    </div>
  );
}
