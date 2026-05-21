import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import DeployVersionCheck from "@/components/DeployVersionCheck";
import { ARTIST_NAME, GALLERY_NAME } from "@/lib/brand";
import {
  isValidFirebaseConfig,
  resolveFirebaseConfig,
} from "@/lib/firebase-config";
import "./globals.css";

const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: `${GALLERY_NAME} — ${ARTIST_NAME}`,
  description: `${GALLERY_NAME}, ${ARTIST_NAME}. Œuvres, expositions et évènements.`,
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseConfig = resolveFirebaseConfig();
  const inlineFirebaseConfig = isValidFirebaseConfig(firebaseConfig)
    ? JSON.stringify(firebaseConfig).replace(/</g, "\\u003c")
    : null;

  return (
    <html lang="fr" className={sans.variable}>
      <head>
        {inlineFirebaseConfig && (
          <script
            id="firebase-config"
            dangerouslySetInnerHTML={{
              __html: `window.__FIREBASE_CONFIG__=${inlineFirebaseConfig};`,
            }}
          />
        )}
        <link
          href="https://api.fontshare.com/v2/css?f[]=butler@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-white text-ink">
        <DeployVersionCheck />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
