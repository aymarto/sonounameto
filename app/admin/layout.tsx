import AdminShell from "@/components/admin/AdminShell";
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
  return <AdminShell>{children}</AdminShell>;
}
