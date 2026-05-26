import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ustalar qidirish",
  description:
    "O'zbekiston bo'ylab ustalarni qidiring: santexnik, elektrik, duradgor, dasturchi va boshqa mutaxassislar. Viloyat va tuman bo'yicha filtrlang.",
  openGraph: {
    title: "Ustalar qidirish — USTAM",
    description:
      "Kerakli ustani kategoriya, viloyat va tuman bo'yicha filtrlang. 500+ professional usta.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "USTAM qidiruv" }],
  },
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
