"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((s) => s.login);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function formatPhone(val: string) {
    const digits = val.replace(/\D/g, "");
    if (digits.startsWith("998")) {
      const d = digits.slice(3, 12);
      let out = "+998";
      if (d.length > 0) out += " " + d.slice(0, 2);
      if (d.length > 2) out += " " + d.slice(2, 5);
      if (d.length > 5) out += " " + d.slice(5, 7);
      if (d.length > 7) out += " " + d.slice(7, 9);
      return out;
    }
    return val;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const rawPhone = "+" + phone.replace(/\D/g, "");
    const result = login(rawPhone, password);
    setLoading(false);
    if (result.success) {
      router.push("/home");
    } else {
      setError(result.error || "Xatolik yuz berdi");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/25 mb-3">
              X
            </div>
            <h1 className="text-2xl font-bold text-slate-900">USTAM ga kirish</h1>
            <p className="text-slate-500 text-sm mt-1">Hisobingizga kiring</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon raqam</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📞</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="+998 90 123 45 67"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Parol</label>
                <button type="button" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm">
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Kirish...</>
              ) : "Kirish"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">yoki</span></div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500">
            Hisobingiz yo&apos;qmi?{" "}
            <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
              Ro&apos;yxatdan o&apos;ting
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs text-amber-700 font-medium mb-1">🧪 Demo kirish:</p>
            <p className="text-xs text-amber-600">Mijoz: <code className="bg-amber-100 px-1 rounded">+998901111111</code> / <code className="bg-amber-100 px-1 rounded">client123</code></p>
            <p className="text-xs text-amber-600 mt-0.5">Usta: <code className="bg-amber-100 px-1 rounded">+998901234567</code> / <code className="bg-amber-100 px-1 rounded">password1</code></p>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/home" className="text-sm text-slate-400 hover:text-slate-600 transition">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
