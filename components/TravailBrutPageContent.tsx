"use client";

import { useEffect, useState } from "react";
import ImageOnlyGrid from "@/components/ImageOnlyGrid";
import { listPublishedRawWorks } from "@/lib/firestore-content";
import { rawWorkImages as staticRawWorks } from "@/lib/site-content";
import type { RawWorkImage } from "@/lib/types";

export default function TravailBrutPageContent() {
  const [images, setImages] = useState<RawWorkImage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedRawWorks();
        if (!cancelled) setImages(rows);
      } catch {
        if (!cancelled) setImages(staticRawWorks);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!images) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  return <ImageOnlyGrid images={images} />;
}
