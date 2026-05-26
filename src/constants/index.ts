// ==========================================
// USTAM - App Constants
// ==========================================

export const APP_NAME = "USTAM";
export const APP_DESCRIPTION = "O'zbekistondagi eng yaxshi ustalar platformasi";
export const APP_TAGLINE = "Yaqiningizdagi eng yaxshi ustalarni toping!";

export const NAV_LINKS = [
  { href: "/home", label: "Bosh sahifa", icon: "🏠" },
  { href: "/search", label: "Qidirish", icon: "🔍" },
  { href: "/profile", label: "Profil", icon: "👤" },
] as const;

export const RATING_LABELS: Record<number, string> = {
  1: "Yomon",
  2: "Qoniqarsiz",
  3: "O'rtacha",
  4: "Yaxshi",
  5: "A'lo",
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  "1": "1 yil",
  "2": "2 yil",
  "3": "3 yil",
  "5": "5 yil",
  "7": "7 yil",
  "10": "10+ yil",
};

export const AVAILABILITY_STATUS = {
  available: { label: "Bo'sh", color: "green" },
  busy: { label: "Band", color: "red" },
} as const;

export const PRICE_RANGES = [
  { label: "50 000 – 100 000 so'm", min: 50000, max: 100000 },
  { label: "100 000 – 200 000 so'm", min: 100000, max: 200000 },
  { label: "200 000 – 500 000 so'm", min: 200000, max: 500000 },
  { label: "500 000+ so'm", min: 500000, max: Infinity },
] as const;

// ==========================================
// O'zbekistonning 14 viloyati va tumanlari
// ==========================================

export interface Region {
  name: string;
  districts: readonly string[];
}

export const REGIONS: readonly Region[] = [
  {
    name: "Toshkent shahri",
    districts: [
      "Bektemir",
      "Chilonzor",
      "Hamza",
      "Mirobod",
      "Mirzo Ulug'bek",
      "Olmazor",
      "Sergeli",
      "Shayxontohur",
      "Uchtepa",
      "Yakkasaroy",
      "Yashnobod",
      "Yunusobod",
    ],
  },
  {
    name: "Toshkent viloyati",
    districts: [
      "Angren",
      "Bo'ka",
      "Bo'stonliq",
      "Chinoz",
      "Ohangaron",
      "Oqqo'rg'on",
      "Parkent",
      "Piskent",
      "Quyi Chirchiq",
      "Qibray",
      "Toshkent tumani",
      "Urtachirchiq",
      "Yangiyo'l",
      "Yuqori Chirchiq",
      "Zangiota",
    ],
  },
  {
    name: "Samarqand viloyati",
    districts: [
      "Bulung'ur",
      "Ishtixon",
      "Jomboy",
      "Kattaqo'rg'on",
      "Narpay",
      "Nurobod",
      "Oqdaryo",
      "Pastdarg'om",
      "Payariq",
      "Paxtachi",
      "Samarqand tumani",
      "Toyloq",
      "Urgut",
    ],
  },
  {
    name: "Farg'ona viloyati",
    districts: [
      "Beshariq",
      "Bog'dod",
      "Buvayda",
      "Dang'ara",
      "Farg'ona tumani",
      "Furqat",
      "Oltiariq",
      "Quva",
      "Qo'shtepa",
      "Rishton",
      "So'x",
      "Toshloq",
      "Uchko'prik",
      "Yozyovon",
    ],
  },
  {
    name: "Andijon viloyati",
    districts: [
      "Andijon tumani",
      "Asaka",
      "Baliqchi",
      "Bo'z",
      "Buloqboshi",
      "Izboskan",
      "Jalolquduq",
      "Marhamat",
      "Oltinko'l",
      "Paxtaobod",
      "Qo'rg'ontepa",
      "Shahrixon",
      "Ulugnor",
      "Xo'jaobod",
    ],
  },
  {
    name: "Namangan viloyati",
    districts: [
      "Chortoq",
      "Chust",
      "Kosonsoy",
      "Mingbuloq",
      "Namangan tumani",
      "Norin",
      "Pop",
      "To'raqo'rg'on",
      "Uchqo'rg'on",
      "Yangiqo'rg'on",
    ],
  },
  {
    name: "Buxoro viloyati",
    districts: [
      "Buxoro tumani",
      "G'ijduvon",
      "Jondor",
      "Kogon",
      "Olot",
      "Peshku",
      "Qorovulbozor",
      "Romitan",
      "Shofirkon",
      "Vobkent",
    ],
  },
  {
    name: "Xorazm viloyati",
    districts: [
      "Bog'ot",
      "Gurlan",
      "Hazorasp",
      "Xiva tumani",
      "Qo'shko'pir",
      "Shovot",
      "Tuproqqal'a",
      "Urganch tumani",
      "Yangiariq",
      "Yangibozor",
    ],
  },
  {
    name: "Qashqadaryo viloyati",
    districts: [
      "Chiroqchi",
      "Dehqonobod",
      "G'uzor",
      "Kasbi",
      "Kitob",
      "Ko'kdala",
      "Mirishkor",
      "Muborak",
      "Nishon",
      "Qarshi tumani",
      "Shahrisabz tumani",
      "Yakkabog'",
    ],
  },
  {
    name: "Surxondaryo viloyati",
    districts: [
      "Angor",
      "Bandixon",
      "Boysun",
      "Denov",
      "Jarqo'rg'on",
      "Muzrabot",
      "Oltinsoy",
      "Qiziriq",
      "Qumqo'rg'on",
      "Sariosiyo",
      "Sherobod",
      "Sho'rchi",
      "Termiz tumani",
      "Uzun",
    ],
  },
  {
    name: "Jizzax viloyati",
    districts: [
      "Arnasoy",
      "Baxmal",
      "Do'stlik",
      "Forish",
      "G'allaorol",
      "Jizzax tumani",
      "Mirzacho'l",
      "Paxtakor",
      "Sharof Rashidov",
      "Zafarobod",
      "Zarbdor",
      "Zomin",
    ],
  },
  {
    name: "Sirdaryo viloyati",
    districts: [
      "Boyovut",
      "Guliston tumani",
      "Mirzaobod",
      "Oqoltin",
      "Sardoba",
      "Sayxunobod",
      "Sirdaryo tumani",
      "Xovos",
    ],
  },
  {
    name: "Navoiy viloyati",
    districts: [
      "Karmana",
      "Konimex",
      "Navbahor",
      "Navoiy tumani",
      "Nurota",
      "Qiziltepa",
      "Tomdi",
      "Uchquduq",
      "Xatirchi",
    ],
  },
  {
    name: "Qoraqalpog'iston Respublikasi",
    districts: [
      "Amudaryo",
      "Beruniy",
      "Chimboy",
      "Ellikkala",
      "Kegeyli",
      "Mo'ynoq",
      "Nukus tumani",
      "Qanliko'l",
      "Qorao'zak",
      "Qo'ng'irot",
      "Shumanay",
      "Taxtako'pir",
      "To'rtko'l",
      "Xo'jayli",
    ],
  },
] as const;

// Flat districts list (backward compat)
export const DISTRICTS = REGIONS.flatMap((r) => r.districts);
