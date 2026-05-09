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

export const DISTRICTS = [
  "Yunusobod",
  "Chilonzor",
  "Mirzo Ulug'bek",
  "Shayxontohur",
  "Yakkasaroy",
] as const;

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
