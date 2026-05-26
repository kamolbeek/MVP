// scripts/seed-admin.mjs  — firebase-admin orqali ishlatiladi (rules ni bypass qiladi)
// Ishlatish:  node scripts/seed-admin.mjs
//
// Birinchi marta:
//   Firebase Console → Project Settings → Service accounts
//   → Generate new private key → scripts/serviceAccountKey.json ga saqlang

import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// ── Service account tekshirish ─────────────────────────────────────────────
const KEY_PATH = "scripts/serviceAccountKey.json";
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf-8"));
} catch {
  console.error(`
❌ Service account key topilmadi: ${KEY_PATH}

Qadamlar:
  1. Firebase Console → Project Settings → Service accounts
  2. "Generate new private key" → JSON faylni yuklab oling
  3. Uni  scripts/serviceAccountKey.json  ga saqlang
  4. Qayta ishga tushiring: node scripts/seed-admin.mjs
`);
  process.exit(1);
}

// ── firebase-admin init ────────────────────────────────────────────────────
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ── Mock data ──────────────────────────────────────────────────────────────
const masterUsers = [
  { id: "m-1",  name: "Jasur Karimov",   phone: "+998901234567", email: "jasur@mail.uz",   role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasur",   createdAt: "2024-01-15" },
  { id: "m-2",  name: "Bobur Toshmatov", phone: "+998901234568", email: "bobur@mail.uz",   role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur",   createdAt: "2024-02-10" },
  { id: "m-3",  name: "Sardor Rahimov",  phone: "+998901234569", email: "sardor@mail.uz",  role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor",  createdAt: "2024-01-20" },
  { id: "m-4",  name: "Sherzod Aliyev",  phone: "+998901234570", email: "sherzod@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sherzod", createdAt: "2024-03-05" },
  { id: "m-5",  name: "Anvar Qodirov",   phone: "+998901234571", email: "anvar@mail.uz",   role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anvar",   createdAt: "2024-02-28" },
  { id: "m-6",  name: "Dilshod Nazarov", phone: "+998901234572", email: "dilshod@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dilshod", createdAt: "2024-04-12" },
  { id: "m-7",  name: "Rustam Sobirov",  phone: "+998901234573", email: "rustam@mail.uz",  role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rustam",  createdAt: "2024-01-08" },
  { id: "m-8",  name: "Farhod Umarov",   phone: "+998901234574", email: "farhod@mail.uz",  role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhod",  createdAt: "2024-05-01" },
  { id: "m-9",  name: "Otabek Mirzayev", phone: "+998901234575", email: "otabek@mail.uz",  role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Otabek",  createdAt: "2024-03-18" },
  { id: "m-10", name: "Nodir Xasanov",   phone: "+998901234576", email: "nodir@mail.uz",   role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nodir",   createdAt: "2024-02-14" },
];

const masterProfiles = [
  { id: "mp-1",  userId: "m-1",  bio: "10 yillik tajribaga ega professional santexnik.",                       categories: ["cat-1"],  rating: 4.8, reviewCount: 45, isAvailable: true,  experience: 10, location: { lat: 41.3111, lng: 69.2797, address: "Yunusobod tumani, 7-mavze",              city: "Toshkent", district: "Yunusobod"    }, portfolio: ["/portfolio/santexnik-1.svg",  "/portfolio/santexnik-2.svg"]  },
  { id: "mp-2",  userId: "m-2",  bio: "Sifatli va ishonchli elektr montaj ishlari.",                          categories: ["cat-2"],  rating: 4.6, reviewCount: 38, isAvailable: true,  experience: 7,  location: { lat: 41.2855, lng: 69.2044, address: "Chilonzor tumani, 10-kvartal",             city: "Toshkent", district: "Chilonzor"     }, portfolio: ["/portfolio/elektrik-1.svg",   "/portfolio/elektrik-2.svg"]   },
  { id: "mp-3",  userId: "m-3",  bio: "Professional duradgor — mebel yasash, ta'mirlash va o'rnatish.",       categories: ["cat-3"],  rating: 4.9, reviewCount: 52, isAvailable: false, experience: 12, location: { lat: 41.3385, lng: 69.3346, address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li", city: "Toshkent", district: "Mirzo Ulug'bek" }, portfolio: ["/portfolio/duradgor-1.svg",   "/portfolio/duradgor-2.svg"]   },
  { id: "mp-4",  userId: "m-4",  bio: "Full-stack dasturchi. React, Next.js, Node.js.",                       categories: ["cat-4"],  rating: 4.7, reviewCount: 29, isAvailable: true,  experience: 5,  location: { lat: 41.3045, lng: 69.2511, address: "Shayxontohur tumani, Navoiy ko'chasi",     city: "Toshkent", district: "Shayxontohur"  }, portfolio: ["/portfolio/dasturchi-1.svg"]                                },
  { id: "mp-5",  userId: "m-5",  bio: "Professional videograf. To'ylar, tadbirlar.",                          categories: ["cat-5"],  rating: 4.5, reviewCount: 33, isAvailable: true,  experience: 6,  location: { lat: 41.2965, lng: 69.2782, address: "Yakkasaroy tumani, Bobur ko'chasi",         city: "Toshkent", district: "Yakkasaroy"    }, portfolio: ["/portfolio/videograf-1.svg",  "/portfolio/videograf-2.svg"]  },
  { id: "mp-6",  userId: "m-6",  bio: "Grafik va UI/UX dizayner. Logotip, brending, veb-sayt.",               categories: ["cat-6"],  rating: 4.8, reviewCount: 41, isAvailable: true,  experience: 8,  location: { lat: 41.3111, lng: 69.2797, address: "Yunusobod tumani, 19-mavze",              city: "Toshkent", district: "Yunusobod"    }, portfolio: ["/portfolio/dizayner-1.svg",   "/portfolio/dizayner-2.svg"]   },
  { id: "mp-7",  userId: "m-7",  bio: "Professional bo'yoqchi. Kvartira va ofis.",                            categories: ["cat-7"],  rating: 4.3, reviewCount: 27, isAvailable: false, experience: 9,  location: { lat: 41.2855, lng: 69.2044, address: "Chilonzor tumani, 3-kvartal",              city: "Toshkent", district: "Chilonzor"     }, portfolio: ["/portfolio/boyoqchi-1.svg"]                                 },
  { id: "mp-8",  userId: "m-8",  bio: "Tajribali payvandchi. Metall konstruksiyalar.",                        categories: ["cat-8"],  rating: 4.6, reviewCount: 35, isAvailable: true,  experience: 11, location: { lat: 41.3385, lng: 69.3346, address: "Mirzo Ulug'bek tumani, Temur ko'chasi",    city: "Toshkent", district: "Mirzo Ulug'bek" }, portfolio: ["/portfolio/payvandchi-1.svg", "/portfolio/payvandchi-2.svg"] },
  { id: "mp-9",  userId: "m-9",  bio: "Professional chilangar. Eshik qulflari.",                              categories: ["cat-9"],  rating: 4.4, reviewCount: 22, isAvailable: true,  experience: 4,  location: { lat: 41.3045, lng: 69.2511, address: "Shayxontohur tumani, Zarqaynar",           city: "Toshkent", district: "Shayxontohur"  }, portfolio: ["/portfolio/chilangar-1.svg"]                                },
  { id: "mp-10", userId: "m-10", bio: "Matematika va fizika bo'yicha tajribali repetitor.",                   categories: ["cat-10"], rating: 4.9, reviewCount: 48, isAvailable: true,  experience: 15, location: { lat: 41.2965, lng: 69.2782, address: "Yakkasaroy tumani, Shota Rustaveli",       city: "Toshkent", district: "Yakkasaroy"    }, portfolio: ["/portfolio/repetitor-1.svg"]                                },
];

// ── Seed ───────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱 Seed boshlandi — project: ${serviceAccount.project_id}\n`);

  const batch = db.batch();

  for (const user of masterUsers) {
    const profile = masterProfiles.find(p => p.userId === user.id);
    if (!profile) { console.warn(`  ⚠ ${user.id} profil topilmadi`); continue; }
    batch.set(db.collection("masters").doc(user.id), { ...user, profile });
  }

  await batch.commit();

  for (const user of masterUsers) {
    console.log(`  ✓  ${user.id.padEnd(5)}  ${user.name}`);
  }

  console.log(`\n✅ 10 ta hujjat Firestore /masters ga atomic batch bilan yozildi.\n`);
}

seed()
  .then(() => process.exit(0))
  .catch(err => { console.error("❌ Xato:", err.message); process.exit(1); });
