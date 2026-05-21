"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProjectCarousel from "@/components/ProjectCarousel";
import { listPublishedProjects } from "@/lib/firestore-content";
import { projects as staticProjects } from "@/lib/site-content";
import type { Project } from "@/lib/types";

export default function HomeProjectsSection() {
  const [items, setItems] = useState<Project[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedProjects();
        if (!cancelled) setItems(rows);
      } catch {
        if (!cancelled) setItems(staticProjects.filter((p) => p.published !== false));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Projets</p>
            <h2 className="section-title mt-2">Séries & collections</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
              Parcourez les projets horizontalement, comme une ligne de
              galeries. Ouvrez une série pour découvrir les œuvres associées.
            </p>
          </div>
          <Link href="/projets" className="btn-line shrink-0 self-start md:self-auto">
            Tous les projets
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {items ? (
          <ProjectCarousel layout="contained" items={items} />
        ) : (
          <div className="container-page animate-pulse py-12 text-sm text-neutral-400">
            Chargement…
          </div>
        )}
      </div>

      <div className="container-page mt-6 md:hidden">
        <Link href="/projets" className="btn-line">
          Tous les projets
        </Link>
      </div>
    </section>
  );
}
