"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";

const NAV_LINKS = [
  { href: "/home", label: "Bosh sahifa" },
  { href: "/search", label: "Ustalar" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoggedIn, logout } = useStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/home");
  }

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${scrolled ? "shadow-md shadow-gray-900/5" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/home" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base" style={{background:"linear-gradient(135deg,#00C896,#00A87E)",boxShadow:"0 4px 12px rgba(0,200,150,0.2)"}}>
                X
              </div>
              <span className="text-lg font-extrabold text-[#0A0A0A] hidden sm:block tracking-tight">Xalq Uchun</span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(l.href)
                      ? "text-brand-700 bg-brand-50"
                      : "text-[#374151] hover:text-[#0A0A0A] hover:bg-gray-50"
                  }`}>
                  {l.label}
                  {isActive(l.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right: Auth ── */}
            <div className="flex items-center gap-2">
              {isLoggedIn && currentUser ? (
                <>
                  {/* Notification bell */}
                  <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </button>

                  {/* Avatar dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-100 ring-2 ring-brand-200">
                        <Image src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                          alt={currentUser.name} width={32} height={32} className="w-full h-full object-cover" unoptimized />
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                        {currentUser.name.split(" ")[0]}
                      </span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 py-2 animate-slide-down" style={{boxShadow:"0 8px 30px rgba(0,0,0,0.12)"}}>
                        {/* User info */}
                        <div className="px-4 py-2.5 border-b border-slate-50">
                          <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{currentUser.role === "master" ? "Usta" : "Mijoz"}</p>
                        </div>

                        <Link href="/profile" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          Profilim
                        </Link>
                        <Link href="/settings" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          Sozlamalar
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                          Chiqish
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition border border-slate-200">
                    Kirish
                  </Link>
                  <Link href="/register"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 shadow-md shadow-emerald-500/20 transition">
                    Ro&apos;yxatdan o&apos;tish
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-white shadow-2xl md:hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <Link href="/home" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">X</div>
                <span className="font-bold text-slate-900">Xalq Uchun</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* User info (if logged in) */}
            {isLoggedIn && currentUser && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border-b border-emerald-100">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-100">
                  <Image src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                    alt={currentUser.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-emerald-600">{currentUser.role === "master" ? "Usta" : "Mijoz"}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(l.href) ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"
                  }`}>
                  {l.label}
                  {isActive(l.href) && <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full" />}
                </Link>
              ))}

              {isLoggedIn && (
                <>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                    Profilim
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                    Sozlamalar
                  </Link>
                </>
              )}
            </nav>

            {/* Bottom auth */}
            <div className="p-4 border-t border-slate-100 space-y-2">
              {isLoggedIn ? (
                <button onClick={handleLogout}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition">
                  Chiqish
                </button>
              ) : (
                <>
                  <Link href="/login" className="block w-full py-3 rounded-xl text-sm font-semibold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition">
                    Kirish
                  </Link>
                  <Link href="/register" className="block w-full py-3 rounded-xl text-sm font-semibold text-center text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition shadow-md shadow-emerald-500/20">
                    Ro&apos;yxatdan o&apos;tish
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
