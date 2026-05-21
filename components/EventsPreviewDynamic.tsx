"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import EventsPreview from "@/components/EventsPreview";
import { listPublishedEvents } from "@/lib/firestore-content";
import type { ArtEvent } from "@/lib/types";

type Props = {
  limit?: number;
};

export default function EventsPreviewDynamic({ limit = 3 }: Props) {
  const { firebaseReady } = useAuth();
  const [events, setEvents] = useState<ArtEvent[] | null>(null);

  useEffect(() => {
    if (!firebaseReady) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedEvents();
        if (!cancelled) setEvents(rows.slice(0, limit));
      } catch {
        if (!cancelled) setEvents([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, limit]);

  if (!firebaseReady || events === null) {
    return (
      <div className="container-page animate-pulse py-12 text-sm text-neutral-400">
        Chargement…
      </div>
    );
  }

  return <EventsPreview events={events} />;
}
