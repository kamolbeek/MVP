"use client";

import { useMemo } from "react";
import Link from "next/link";
import { User, MasterProfile } from "@/types";

type Tab = "edit" | "portfolio" | "reviews" | "settings";

interface CheckItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  tab: Tab;
  points: number;
  done: boolean;
}

function buildItems(user: User, p: Partial<MasterProfile>): CheckItem[] {
  return [
    {
      id: "avatar",
      label: "Profil rasmi",
      description: "Haqiqiy foto yuklab qo'ying — mijozlar ishonchi oshadi",
      icon: "📷",
      tab: "edit",
      points: 15,
      done: !user.avatar.includes("dicebear"),
    },
    {
      id: "bio",
      label: "O'zingiz haqida",
      description: "Tajriba va xizmatlaringizni tasvirlab bering (10+ so'z)",
      icon: "✍️",
      tab: "edit",
      points: 20,
      done: (p.bio ?? "").trim().split(/\s+/).filter(Boolean).length >= 10,
    },
    {
      id: "categories",
      label: "Mutaxassislik",
      description: "Qaysi soha bo'yicha usta ekanligingizni belgilang",
      icon: "🏷️",
      tab: "edit",
      points: 15,
      done: (p.categories ?? []).length > 0,
    },
    {
      id: "hourlyRate",
      label: "Narx (so'm/soat)",
      description: "Xizmat narxingizni ko'rsating — mijozlar filtrlab topadi",
      icon: "💰",
      tab: "edit",
      points: 15,
      done: (p.hourlyRate ?? 0) > 0,
    },
    {
      id: "portfolio",
      label: "Portfolio rasmlari",
      description: "Kamida 3 ta bajargan ishingizdan rasm qo'shing",
      icon: "🖼️",
      tab: "portfolio",
      points: 20,
      done: (p.portfolio ?? []).length >= 3,
    },
    {
      id: "workHours",
      label: "Ish vaqti",
      description: "Qaysi kun va soatlarda ish qilishingizni ko'rsating",
      icon: "🕐",
      tab: "edit",
      points: 15,
      done: (p.workHours ?? "").trim().length > 0,
    },
  ];
}

function pStyle(pct: number) {
  if (pct >= 80)
    return { bar: "from-emerald-400 to-teal-500",  text: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-100" };
  if (pct >= 50)
    return { bar: "from-amber-400 to-orange-400",  text: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100"  };
  return   { bar: "from-orange-400 to-rose-400",   text: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-100" };
}

export function computeCompletion(user: User, profile: Partial<MasterProfile>) {
  const items  = buildItems(user, profile);
  const total  = items.reduce((s, i) => s + i.points, 0);
  const earned = items.filter(i => i.done).reduce((s, i) => s + i.points, 0);
  return { items, percent: Math.round((earned / total) * 100) };
}

/* ── Full section — profile page ───────────────────────────────── */
export function ProfileCompletionSection({
  user,
  profile,
  onTabChange,
}: {
  user: User;
  profile: Partial<MasterProfile>;
  onTabChange: (tab: Tab) => void;
}) {
  const { items, percent } = useMemo(() => computeCompletion(user, profile), [user, profile]);
  const missing = items.filter(i => !i.done);
  const st = pStyle(percent);

  if (percent >= 100) return null;

  const headline =
    percent < 30 ? "Profilingizni to'ldirishni boshlang" :
    percent < 60 ? "Yaxshi ketmoqda, davom eting!" :
    percent < 80 ? "Deyarli tayyor, biroz qoldi!" :
                   "Oxirgi bir nechta band!";

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Profil to&apos;liqligi
          </p>
          <span className={`text-[24px] font-extrabold tabular-nums leading-none ${st.text}`}>
            {percent}%
          </span>
        </div>
        <p className="text-[15px] font-semibold text-gray-900 mb-3">{headline}</p>

        {/* Progress bar */}
        <div className="h-[7px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${st.bar} transition-all duration-700 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {missing.length > 0 && (
          <p className="text-[12px] text-gray-400 mt-2 leading-snug">
            {missing.length} ta bandni to&apos;ldiring — qidiruvda yuqori ko&apos;rinasiz ↑
          </p>
        )}
      </div>

      {missing.length > 0 && (
        <>
          <div className="h-px bg-gray-50 mx-5" />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {missing.map(item => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.tab)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-left transition-colors group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${st.bg} flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 group-hover:translate-x-0.5 transition-all"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Compact banner — home / dashboard ─────────────────────────── */
export function ProfileCompletionBanner({
  user,
  profile,
}: {
  user: User;
  profile: Partial<MasterProfile>;
}) {
  const { percent, items } = useMemo(() => computeCompletion(user, profile), [user, profile]);
  const st = pStyle(percent);
  const missing = items.filter(i => !i.done);

  if (percent >= 100) return null;

  return (
    <Link href="/profile">
      <div
        className={`flex items-center gap-4 p-4 bg-white rounded-2xl border ${st.border} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl ${st.bg} flex items-center justify-center text-xl shrink-0`}>
          📋
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
              Profil <span className={`${st.text}`}>{percent}%</span> to&apos;liq
            </p>
            <span className={`text-[12px] font-semibold ${st.text} shrink-0 ml-3`}>
              {missing.length} band →
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${st.bar} transition-all duration-700`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            To&apos;ldirish uchun bosing — ko&apos;proq mijoz topasiz
          </p>
        </div>
      </div>
    </Link>
  );
}
