"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/components/AuthProvider";
import { subscribeEvents } from "@/lib/firestore";
import { formatDateRange } from "@/lib/format";
import type { ArtEvent } from "@/lib/types";

export default function AdminEventsPage() {
  const { user, firebaseReady } = useAuth();
  const [events, setEvents] = useState<ArtEvent[] | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeEvents((rows) => setEvents(rows));
    return () => unsub();
  }, [firebaseReady, user]);

  return (
    <>
      <AdminHeader
        eyebrow="Évènements"
        title="Mes évènements"
        description="Liste de tous les évènements à venir et passés."
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
              <Link
                href={`/admin/evenements/edit?id=${ev.id}`}
                className="grid items-center gap-2 px-4 py-5 transition-colors hover:bg-neutral-50 md:grid-cols-[180px_1fr_auto] md:gap-8 md:px-6"
              >
                <p className="text-xs uppercase tracking-wide-xl text-neutral-500">
                  {formatDateRange(ev.startDate, ev.endDate)}
                </p>
                <div>
                  <p className="font-display text-xl leading-tight">
                    {ev.title}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {ev.location}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wide-xl text-neutral-500">
                  Modifier →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
