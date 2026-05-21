import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import OeuvresPageContent from "@/components/OeuvresPageContent";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Œuvres"),
  description: `Œuvres de ${ARTIST_NAME} : portraits, séries et études.`,
};

export default function OeuvresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Œuvres"
        title="Œuvres"
        description="Portraits, séries et études. Cliquez sur une œuvre pour voir le détail et toutes les images."
      />
      <section className="page-content">
        <OeuvresPageContent />
      </section>
    </>
  );
}
