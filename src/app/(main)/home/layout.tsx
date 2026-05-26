import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bosh sahifa",
  description:
    "O'zbekistondagi eng yaxshi ustalarni toping — santexnik, elektrik, duradgor, dasturchi va boshqalar. Tez toping, ishonch bilan bog'laning.",
  openGraph: {
    title: "USTAM — Bosh sahifa",
    description:
      "O'zbekistondagi #1 ustalar platformasi. 500+ tasdiqlangan usta, 10 000+ mamnun mijoz.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "USTAM bosh sahifa" }],
  },
  alternates: { canonical: "/home" },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
