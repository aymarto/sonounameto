import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ImageOnlyGrid from "@/components/ImageOnlyGrid";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";
import { rawWorkImages } from "@/lib/site-content";

export const metadata: Metadata = {
  title: pageTitle("Travail brut"),
  description: `Travail brut — images de ${ARTIST_NAME}.`,
};

export default function TravailBrutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Travail brut"
        title="Travail brut"
        description="Sélection d'images sans texte — matière, geste et recherche plastique."
      />
      <section className="page-content">
        <ImageOnlyGrid images={rawWorkImages} />
      </section>
    </>
  );
}
