import type { Metadata } from "next";
import "./globals.css";
import ThemeInitializer from "@/components/shared/ThemeInitializer";

export const metadata: Metadata = {
  title: "USTAM — O'zbekistondagi eng yaxshi ustalar platformasi",
  description:
    "Yaqiningizdagi eng yaxshi santexnik, elektrik, duradgor, dasturchi va boshqa ustalarni toping. USTAM — O'zbekiston ustalar platformasi.",
  keywords: "ustalar, santexnik, elektrik, dasturchi, Toshkent, O'zbekiston",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
