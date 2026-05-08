import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xalq Uchun — O'zbekistondagi eng yaxshi ustalar platformasi",
  description:
    "Yaqiningizdagi eng yaxshi santexnik, elektrik, duradgor, dasturchi va boshqa ustalarni toping. Xalq Uchun — O'zbekiston ustalar platformasi.",
  keywords: "ustalar, santexnik, elektrik, dasturchi, Toshkent, O'zbekiston",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
