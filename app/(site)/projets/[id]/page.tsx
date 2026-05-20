import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import OeuvresGrid from "@/components/OeuvresGrid";
import { pageTitle } from "@/lib/brand";
import { artworks } from "@/lib/data";
import { getProject } from "@/lib/site-content";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.id);
  if (!project) return { title: pageTitle("Projet") };
  return {
    title: pageTitle(project.title),
    description: `Œuvres du projet ${project.title}.`,
  };
}

export default function ProjetDetailPage({ params }: Props) {
  const project = getProject(params.id);
  if (!project) notFound();

  const projectArtworks = artworks.filter((a) =>
    project.artworkIds.includes(a.id)
  );

  return (
    <>
      <PageHeader
        eyebrow="Projet"
        title={project.title}
        description={`${projectArtworks.length} œuvre${projectArtworks.length > 1 ? "s" : ""} dans ce projet.`}
      />
      <section className="page-content">
        <OeuvresGrid items={projectArtworks} />
      </section>
    </>
  );
}
