"use client";

import EventsPreview from "@/components/EventsPreview";
import { listPublishedEvents } from "@/lib/firestore-content";
import { useCmsQuery } from "@/lib/use-cms-query";
import type { ArtEvent } from "@/lib/types";

type Props = {
  limit?: number;
};

export default function EventsPreviewDynamic({ limit = 3 }: Props) {
  const { data, loading, ready } = useCmsQuery<ArtEvent[]>(
    () => listPublishedEvents(),
    [limit]
  );

  if (loading) {
    return (
      <div className="container-page animate-pulse py-12 text-sm text-neutral-400">
        Chargement…
      </div>
    );
  }

  if (!ready) return null;

  const events = (data ?? []).slice(0, limit);
  return <EventsPreview events={events} />;
}
