import AdminShell from "@/components/admin/AdminShell";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { pageTitle } from "@/lib/brand";

export const metadata = {
  title: pageTitle("Admin"),
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsProvider>
      <AdminShell>{children}</AdminShell>
    </SiteSettingsProvider>
  );
}
