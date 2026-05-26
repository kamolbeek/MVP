import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/home" className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 mb-8 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Bosh sahifaga qaytish
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl">🔒</div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0A0A0A]">Maxfiylik siyosati</h1>
              <p className="text-sm text-[#6B7280]">Oxirgi yangilangan: 2025-yil, yanvar</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">1. Umumiy ma&apos;lumot</h2>
              <p className="text-[#374151] leading-relaxed">USTAM platformasi foydalanuvchilarning shaxsiy ma&apos;lumotlarini himoya qilishga jiddiy yondashadi. Ushbu Maxfiylik siyosati sizning ma&apos;lumotlaringiz qanday yig&apos;ilishi, ishlatilishi va himoya qilinishini tushuntiradi.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">2. Qanday ma&apos;lumotlar yig&apos;iladi</h2>
              <ul className="list-disc pl-5 text-[#374151] space-y-1.5">
                <li>Ism familiya va telefon raqam</li>
                <li>Joylashuv ma&apos;lumotlari (tuman, shahar)</li>
                <li>Usta profil ma&apos;lumotlari (tajriba, kategoriya, portfolio)</li>
                <li>Sharhlar va baholar</li>
                <li>Qurilma va brauzer ma&apos;lumotlari</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">3. Ma&apos;lumotlardan foydalanish</h2>
              <p className="text-[#374151] leading-relaxed">Sizning ma&apos;lumotlaringiz faqat platforma xizmatlarini ko&apos;rsatish maqsadida ishlatiladi:</p>
              <ul className="list-disc pl-5 text-[#374151] space-y-1.5 mt-2">
                <li>Ustalar va mijozlarni bog&apos;lash</li>
                <li>Xizmat sifatini yaxshilash</li>
                <li>Bildirishnomalar yuborish</li>
                <li>Platformani xavfsiz saqlash</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">4. Ma&apos;lumotlar himoyasi</h2>
              <p className="text-[#374151] leading-relaxed">Barcha shaxsiy ma&apos;lumotlar shifrlangan holda saqlanadi. Uchinchi shaxslarga sizning roziligingiz holda ma&apos;lumot berilmaydi. Parollar hash qilingan holda saqlanadi.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">5. Foydalanuvchi huquqlari</h2>
              <p className="text-[#374151] leading-relaxed">Siz istalgan vaqtda o&apos;z ma&apos;lumotlaringizni ko&apos;rish, tahrirlash yoki o&apos;chirish huquqiga egasiz. Hisobingizni o&apos;chirish uchun profil sozlamalariga o&apos;ting.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">6. Aloqa</h2>
              <p className="text-[#374151] leading-relaxed">Savollaringiz bo&apos;lsa, bizga murojaat qiling: <a href="mailto:info@ustam.uz" className="text-brand-600 hover:underline">info@ustam.uz</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
