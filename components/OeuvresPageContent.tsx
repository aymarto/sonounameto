"use client";

import { useEffect, useState } from "react";
import OeuvresGrid from "@/components/OeuvresGrid";
import { listPublishedArtworks } from "@/lib/firestore-content";
import { artworks as staticArtworks } from "@/lib/data";
import type { Artwork } from "@/lib/types";

export default function OeuvresPageContent() {
  const [items, setItems] = useState<Artwork[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedArtworks();
        if (!cancelled) setItems(rows);
      } catch {
        if (!cancelled) setItems(staticArtworks);
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

  return <OeuvresGrid items={items} />;
}
