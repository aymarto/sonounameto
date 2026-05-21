"use client";

import { useEffect, useState } from "react";
import ContentUnavailable from "@/components/ContentUnavailable";
import ReferencesGrid from "@/components/ReferencesGrid";
import { useAuth } from "@/components/AuthProvider";
import { listPublishedReferences } from "@/lib/firestore-content";
import type { ReferenceItem } from "@/lib/types";

export default function ReferencesPageContent() {
  const { firebaseReady } = useAuth();
  const [items, setItems] = useState<ReferenceItem[] | null>(null);

  useEffect(() => {
    if (!firebaseReady) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedReferences();
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

  return <ReferencesGrid items={items} />;
}
