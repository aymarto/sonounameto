"use client";

import ContentUnavailable from "@/components/ContentUnavailable";
import ImageOnlyGrid from "@/components/ImageOnlyGrid";
import { listPublishedRawWorks } from "@/lib/firestore-content";
import { useCmsQuery } from "@/lib/use-cms-query";
import type { RawWorkImage } from "@/lib/types";

export default function TravailBrutPageContent() {
  const { data, loading, ready } = useCmsQuery<RawWorkImage[]>(
    () => listPublishedRawWorks()
  );
  const images = data ?? [];

  if (loading) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (ready && images.length === 0) {
    return <ContentUnavailable />;
  }

  if (!ready) return null;

  return <ImageOnlyGrid images={images} />;
}
