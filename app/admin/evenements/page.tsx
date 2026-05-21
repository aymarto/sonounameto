"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPublishBadge from "@/components/admin/AdminPublishBadge";
import { useAuth } from "@/components/AuthProvider";
import { subscribeEvents, updateEvent } from "@/lib/firestore";
import { formatDateRange } from "@/lib/format";
import type { ArtEvent, EventCategory } from "@/lib/types";

function categoryLabel(c?: EventCategory): string {
  if (c === "evenement") return "Évènement";
  return "Exposition";
}

export default function AdminEventsPage() {
  const { user, firebaseReady } = useAuth();
  const [events, setEvents] = useState<ArtEvent[] | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeEvents((rows) => setEvents(rows));
    return () => unsub();
  }, [firebaseReady, user]);

  async function handleTogglePublished(ev: ArtEvent) {
    setTogglingId(ev.id);
    try {
      await updateEvent(ev.id, { published: !(ev.published !== false) });
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <AdminHeader
        eyebrow="Expositions & Évènements"
        title="Expositions & Évènements"
        description="Liste des expositions, salons, résidences et autres évènements."
        action={{
          href: "/admin/evenements/nouveau",
          label: "+ Nouvel évènement",
        }}
      />

      {events === null ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : events.length === 0 ? (
        <div className="border border-dashed border-black/20 bg-white p-12 text-center">
          <p className="font-display text-2xl">Aucun évènement</p>
          <p className="mt-3 text-sm text-neutral-600">
            Ajoutez votre premier évènement.
          </p>
          <Link
            href="/admin/evenements/nouveau"
            className="btn-line mt-6 inline-flex"
          >
            + Ajouter un évènement
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-black/10 border-y border-black/10 bg-white">
          {events.map((ev) => (
            <li key={ev.id}>
              <div className="flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
                <Link
                  href={`/admin/evenements/edit?id=${ev.id}`}
                  className="min-w-0 flex-1 transition-colors hover:bg-neutral-50 md:-mx-6 md:px-6 md:py-1"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-xs uppercase tracking-wide-xl text-neutral-500">
                      {formatDateRange(ev.startDate, ev.endDate)}
                    </p>
                    <AdminPublishBadge published={ev.published} className="align-middle" />
                    <span className="text-[10px] uppercase tracking-wide-xl text-neutral-400">
                      {categoryLabel(ev.category)}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl leading-tight">
                    {ev.title}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{ev.location}</p>
                </Link>
                <div className="flex shrink-0 items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={togglingId === ev.id}
                    onClick={() => handleTogglePublished(ev)}
                    className="whitespace-nowrap text-xs uppercase tracking-wide-xl text-neutral-700 underline-offset-2 hover:text-black hover:underline disabled:opacity-50"
                  >
                    {togglingId === ev.id
                      ? "…"
                      : ev.published === false
                      ? "Publier"
                      : "Masquer"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
