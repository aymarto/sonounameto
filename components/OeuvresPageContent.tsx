"use client";

import ContentUnavailable from "@/components/ContentUnavailable";
import OeuvresGrid from "@/components/OeuvresGrid";
import { listPublishedArtworks } from "@/lib/firestore-content";
import { useCmsQuery } from "@/lib/use-cms-query";
import type { Artwork } from "@/lib/types";

export default function OeuvresPageContent() {
  const { data, loading, ready } = useCmsQuery<Artwork[]>(
    () => listPublishedArtworks()
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

  return <OeuvresGrid items={items} />;
}
