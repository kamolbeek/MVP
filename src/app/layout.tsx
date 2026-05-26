import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/shared/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ustam.uz";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "USTAM — O'zbekistondagi eng yaxshi ustalar platformasi",
    template: "%s | USTAM",
  },
  description:
    "Yaqiningizdagi eng yaxshi santexnik, elektrik, duradgor, dasturchi va boshqa ustalarni toping. USTAM — O'zbekiston ustalar platformasi.",
  keywords: [
    "ustalar", "santexnik", "elektrik", "duradgor", "dasturchi",
    "Toshkent", "O'zbekiston", "usta topish", "uy ta'miri xizmatlari",
  ],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "USTAM",
    title: "USTAM — O'zbekistondagi eng yaxshi ustalar platformasi",
    description:
      "Yaqiningizdagi eng yaxshi santexnik, elektrik, duradgor va boshqa ustalarni toping.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "USTAM platformasi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "USTAM — Ustalar platformasi",
    description: "O'zbekistondagi eng yaxshi ustalarni toping.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
