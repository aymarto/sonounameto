import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteReadyGate from "@/components/SiteReadyGate";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteReadyGate>
      <Navbar />
      <main className="relative z-0 min-h-screen">{children}</main>
      <Footer />
    </SiteReadyGate>
  );
}
