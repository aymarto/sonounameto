"use client";

import { useEffect, useState } from "react";
import ContentUnavailable from "@/components/ContentUnavailable";
import ProjectsGrid from "@/components/ProjectsGrid";
import { useAuth } from "@/components/AuthProvider";
import { listPublishedProjects } from "@/lib/firestore-content";
import type { Project } from "@/lib/types";

export default function ProjetsPageContent() {
  const { firebaseReady } = useAuth();
  const [items, setItems] = useState<Project[] | null>(null);

  useEffect(() => {
    if (!firebaseReady) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedProjects();
        if (!cancelled) setItems(rows);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady]);

  if (!firebaseReady || items === null) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (items.length === 0) {
    return <ContentUnavailable />;
  }

  return <ProjectsGrid items={items} />;
}
