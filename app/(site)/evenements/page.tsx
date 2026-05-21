import type { Metadata } from "next";
import EvenementsPageContent from "@/components/EvenementsPageContent";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Expositions & Évènements"),
  description: `Expositions et évènements de ${ARTIST_NAME}.`,
};

export default function EvenementsPage() {
  return <EvenementsPageContent />;
}
