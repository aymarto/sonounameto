"use client";

import { useEffect, useState } from "react";
import CmsImage from "@/components/CmsImage";
import ContentUnavailable from "@/components/ContentUnavailable";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/components/AuthProvider";
import { formatDateRange } from "@/lib/format";
import { listPublishedEvents } from "@/lib/firestore-content";
import type { ArtEvent } from "@/lib/types";

export default function EvenementsPageContent() {
  const { firebaseReady } = useAuth();
  const [events, setEvents] = useState<ArtEvent[] | null>(null);

  useEffect(() => {
    if (!firebaseReady) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await listPublishedEvents();
        if (!cancelled) setEvents(rows);
      } catch {
        if (!cancelled) setEvents([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady]);

  if (!firebaseReady || events === null) {
    return (
      <div className="container-page animate-pulse py-16 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Expositions & Évènements"
        description="Expositions, résidences et salons. Les prochains rendez-vous pour découvrir les œuvres en personne."
      />

      <section className="page-content">
        {events.length === 0 ? (
          <ContentUnavailable />
        ) : (
          <div className="container-page space-y-10 md:space-y-12">
            {events.map((ev, i) => (
              <article
                key={ev.id}
                id={ev.id}
                className={`grid gap-6 md:grid-cols-2 md:items-center md:gap-10 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {ev.imageUrl && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <CmsImage
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="eyebrow">
                    {ev.category === "exposition"
                      ? "Exposition"
                      : ev.category === "evenement"
                        ? "Évènement"
                        : "Agenda"}{" "}
                    · {formatDateRange(ev.startDate, ev.endDate)}
                  </p>
                  <h2 className="section-title mt-2">{ev.title}</h2>
                  <p className="mt-1 text-sm uppercase tracking-wide-xl text-neutral-500">
                    {ev.location}
                  </p>
                  <p className="mt-4 max-w-xl text-neutral-700 leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
