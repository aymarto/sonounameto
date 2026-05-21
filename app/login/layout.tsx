import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteSettingsProvider>{children}</SiteSettingsProvider>;
}
