import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish",
  description: "USTAM platformasiga ro'yxatdan o'ting va yaqin atrofdagi ustalar bilan bog'laning.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
