import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati — USTAM",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/home" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Bosh sahifaga qaytish
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              Huquqiy
            </span>
            <h1 className="text-3xl font-extrabold text-[#0A0A0A] tracking-tight">Maxfiylik siyosati</h1>
            <p className="text-gray-500 mt-2 text-sm">Oxirgi yangilanish: 2025-yil 1-yanvar</p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              Bu sahifa hozirda tayyorlanmoqda. To&apos;liq maxfiylik siyosati tez orada e&apos;lon qilinadi.
            </div>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">1. Umumiy ma&apos;lumot</h2>
              <p>
                USTAM platforma foydalanuvchilarining shaxsiy ma&apos;lumotlarini himoya qilishga
                va maxfiyligini ta&apos;minlashga majburdir. Ushbu siyosat qaysi ma&apos;lumotlar
                to&apos;planishini va ular qanday ishlatilishini tushuntiradi.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">2. To&apos;planadigan ma&apos;lumotlar</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Ism va familiya</li>
                <li>Telefon raqami</li>
                <li>Elektron pochta manzili</li>
                <li>Joylashuv ma&apos;lumotlari (faqat ko&apos;rsatilgan hollarda)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">3. Aloqa</h2>
              <p>
                Savollaringiz bo&apos;lsa:{" "}
                <a href="mailto:info@ustam.uz" className="text-emerald-600 hover:underline font-medium">
                  info@ustam.uz
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
