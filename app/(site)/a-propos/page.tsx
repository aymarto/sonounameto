import type { Metadata } from "next";
import AboutPageContent from "@/components/AboutPageContent";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("À propos"),
  description: `Biographie et démarche artistique de ${ARTIST_NAME}.`,
};

export default function AProposPage() {
  return <AboutPageContent />;
}
