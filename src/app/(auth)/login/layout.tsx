import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirish",
  description: "USTAM hisobingizga kiring va yaqin atrofdagi eng yaxshi ustalarni toping.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
