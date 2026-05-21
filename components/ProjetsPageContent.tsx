"use client";

import { useEffect, useState } from "react";
import ProjectsGrid from "@/components/ProjectsGrid";
import { listPublishedProjects } from "@/lib/firestore-content";
import { projects as staticProjects } from "@/lib/site-content";
import type { Project } from "@/lib/types";

export default function ProjetsPageContent() {
  const [items, setItems] = useState<Project[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedProjects();
        if (!cancelled) setItems(rows);
      } catch {
        if (!cancelled) setItems(staticProjects);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  return <ProjectsGrid items={items} />;
}
