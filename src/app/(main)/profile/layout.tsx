import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mening profilim",
  description: "USTAM shaxsiy profil sahifasi.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
