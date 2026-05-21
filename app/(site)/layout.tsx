import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteReadyGate from "@/components/SiteReadyGate";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsProvider>
      <SiteReadyGate>
        <Navbar />
        <main className="relative z-0 min-h-screen overflow-x-visible">{children}</main>
        <Footer />
      </SiteReadyGate>
    </SiteSettingsProvider>
  );
}
