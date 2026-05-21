"use client";

import { useEffect, useState } from "react";
import ContentUnavailable from "@/components/ContentUnavailable";
import ImageOnlyGrid from "@/components/ImageOnlyGrid";
import { useAuth } from "@/components/AuthProvider";
import { listPublishedRawWorks } from "@/lib/firestore-content";
import type { RawWorkImage } from "@/lib/types";

export default function TravailBrutPageContent() {
  const { firebaseReady } = useAuth();
  const [images, setImages] = useState<RawWorkImage[] | null>(null);

  useEffect(() => {
    if (!firebaseReady) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedRawWorks();
        if (!cancelled) setImages(rows);
      } catch {
        if (!cancelled) setImages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady]);

  if (!firebaseReady || images === null) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (images.length === 0) {
    return <ContentUnavailable />;
  }

  return <ImageOnlyGrid images={images} />;
}
