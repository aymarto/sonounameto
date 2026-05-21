"use client";

import { useEffect, useState } from "react";
import EventsPreview from "@/components/EventsPreview";
import { listPublishedEvents } from "@/lib/firestore-content";
import type { ArtEvent } from "@/lib/types";

type Props = {
  limit?: number;
};

export default function EventsPreviewDynamic({ limit = 3 }: Props) {
  const [events, setEvents] = useState<ArtEvent[] | null>(null);

  useEffect(() => {
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
  }, [limit]);

  if (events === null) return null;

  return <EventsPreview events={events} />;
}
