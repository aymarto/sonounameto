"use client";

import { useEffect, useState } from "react";
import ReferencesGrid from "@/components/ReferencesGrid";
import { listPublishedReferences } from "@/lib/firestore-content";
import { references as staticReferences } from "@/lib/site-content";
import type { ReferenceItem } from "@/lib/types";

export default function ReferencesPageContent() {
  const [items, setItems] = useState<ReferenceItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedReferences();
        if (!cancelled) setItems(rows);
      } catch {
        if (!cancelled) setItems(staticReferences);
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

  return <ReferencesGrid items={items} />;
}
