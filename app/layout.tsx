import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "SONOUNAMETO — Galerie de l'artiste",
  description:
    "Galerie officielle de l'artiste SONOUNAMETO. Œuvres, évènements et expositions.",
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={sans.variable}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=butler@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-white text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
