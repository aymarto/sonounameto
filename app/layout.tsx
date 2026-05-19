import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SONOUNAMETO — Galerie de l'artiste",
  description:
    "Galerie officielle de l'artiste SONOUNAMETO. Œuvres, évènements et expositions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans bg-white text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
