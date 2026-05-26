import type { Metadata } from "next";
import { getMasterWithProfile, categories } from "@/lib/mock/data";

type Props = { params: { id: string }; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const master = getMasterWithProfile(params.id);

  if (!master) {
    return {
      title: "Usta topilmadi",
      robots: { index: false, follow: false },
    };
  }

  const cat = categories.find((c) => c.id === master.profile.categories[0]);
  const title = `${master.name} — ${cat?.name ?? "Usta"}`;
  const description = `${master.name}: ${master.profile.bio} Reyting: ${master.profile.rating}/5 · ${master.profile.experience} yil tajriba · ${master.profile.location.district}, Toshkent.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | USTAM`,
      description,
      images: [
        {
          url: master.avatar,
          width: 400,
          height: 400,
          alt: master.name,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${title} | USTAM`,
      description,
      images: [master.avatar],
    },
    alternates: { canonical: `/master/${params.id}` },
  };
}

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
