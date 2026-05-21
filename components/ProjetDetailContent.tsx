"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import OeuvresGrid from "@/components/OeuvresGrid";
import {
  getPublishedProject,
  listPublishedArtworks,
} from "@/lib/firestore-content";
import { isPublished } from "@/lib/publish";
import type { Artwork, Project } from "@/lib/types";

type Props = {
  id: string;
};

export default function ProjetDetailContent({ id }: Props) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await getPublishedProject(id);
      if (cancelled) return;
      if (!p || !isPublished(p)) {
        setProject(null);
        return;
      }
      setProject(p);
      const all = await listPublishedArtworks();
      if (!cancelled) {
        setArtworks(all.filter((a) => p.artworkIds.includes(a.id)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (project === undefined) {
    return (
      <div className="container-page animate-pulse py-16 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (!project) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Projet"
        title={project.title}
        description={`${artworks.length} œuvre${artworks.length > 1 ? "s" : ""} dans ce projet.`}
      />
      <section className="page-content">
        <OeuvresGrid items={artworks} />
      </section>
    </>
  );
}
