"use client";

import ContentUnavailable from "@/components/ContentUnavailable";
import ReferencesGrid from "@/components/ReferencesGrid";
import { listPublishedReferences } from "@/lib/firestore-content";
import { useCmsQuery } from "@/lib/use-cms-query";
import type { ReferenceItem } from "@/lib/types";

export default function ReferencesPageContent() {
  const { data, loading, ready } = useCmsQuery<ReferenceItem[]>(
    () => listPublishedReferences()
  );
  const items = data ?? [];

  if (loading) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (ready && items.length === 0) {
    return <ContentUnavailable />;
  }

  if (!ready) return null;

  return <ReferencesGrid items={items} />;
}
