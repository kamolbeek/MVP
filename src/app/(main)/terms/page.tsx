import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/home" className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 mb-8 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Bosh sahifaga qaytish
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl">📋</div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0A0A0A]">Foydalanish shartlari</h1>
              <p className="text-sm text-[#6B7280]">Oxirgi yangilangan: 2025-yil, yanvar</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">1. Platformadan foydalanish</h2>
              <p className="text-[#374151] leading-relaxed">USTAM platformasidan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz. Platforma ustalar va mijozlarni bog&apos;lash uchun xizmat qiladi.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">2. Ro&apos;yxatdan o&apos;tish</h2>
              <ul className="list-disc pl-5 text-[#374151] space-y-1.5">
                <li>Ro&apos;yxatdan o&apos;tish uchun haqiqiy telefon raqam kerak</li>
                <li>Bir kishi faqat bitta hisob yaratishi mumkin</li>
                <li>Siz kiritgan ma&apos;lumotlar to&apos;g&apos;ri bo&apos;lishi kerak</li>
                <li>Hisobingiz xavfsizligi uchun siz javobgarsiz</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">3. Ustalar uchun qoidalar</h2>
              <ul className="list-disc pl-5 text-[#374151] space-y-1.5">
                <li>Profilingizda haqiqiy ma&apos;lumotlar ko&apos;rsating</li>
                <li>Ishlarni sifatli va vaqtida bajaring</li>
                <li>Mijozlar bilan hurmatli munosabatda bo&apos;ling</li>
                <li>Narxlar haqida shaffof bo&apos;ling</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">4. Mijozlar uchun qoidalar</h2>
              <ul className="list-disc pl-5 text-[#374151] space-y-1.5">
                <li>Ustalar bilan hurmatli munosabatda bo&apos;ling</li>
                <li>Adolatli baho va haqiqiy sharhlar qoldiring</li>
                <li>Kelishilgan shartlarga rioya qiling</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">5. Taqiqlangan harakatlar</h2>
              <ul className="list-disc pl-5 text-[#374151] space-y-1.5">
                <li>Soxta hisob yaratish</li>
                <li>Soxta sharhlar yozish</li>
                <li>Platformani buzish yoki zararli dasturlar tarqatish</li>
                <li>Boshqa foydalanuvchilarga nisbatan noqonuniy harakatlar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">6. Javobgarlikni cheklash</h2>
              <p className="text-[#374151] leading-relaxed">USTAM platformasi faqat vositachilik xizmatini ko&apos;rsatadi. Usta va mijoz o&apos;rtasidagi kelishuvlar uchun platforma javobgar emas. Ish sifati va to&apos;lovlar bo&apos;yicha javobgarlik tomonlarda qoladi.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">7. O&apos;zgartirishlar</h2>
              <p className="text-[#374151] leading-relaxed">Biz ushbu shartlarni istalgan vaqtda o&apos;zgartirish huquqini saqlaymiz. O&apos;zgarishlar haqida platformada xabar beriladi.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-2">8. Aloqa</h2>
              <p className="text-[#374151] leading-relaxed">Savollaringiz bo&apos;lsa: <a href="mailto:info@ustam.uz" className="text-brand-600 hover:underline">info@ustam.uz</a> yoki <a href="tel:+998711234567" className="text-brand-600 hover:underline">+998 71 123 45 67</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
