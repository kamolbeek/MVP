import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AIAssistant from "@/components/features/AIAssistant";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIAssistant />
    </>
  );
}
