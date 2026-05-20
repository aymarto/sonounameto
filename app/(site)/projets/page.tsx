import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectsGrid from "@/components/ProjectsGrid";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Projets"),
  description: `Projets et séries de ${ARTIST_NAME}.`,
};

export default function ProjetsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projets"
        title="Projets"
        description="Séries et collections. Ouvrez un projet pour découvrir les œuvres associées."
      />
      <section className="page-content">
        <ProjectsGrid />
      </section>
    </>
  );
}
