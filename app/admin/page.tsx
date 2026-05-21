"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/components/AuthProvider";
import { listArtworks, listEvents } from "@/lib/firestore";
import {
  listProjects,
  listRawWorks,
  listReferences,
} from "@/lib/firestore-content";

async function loadCounts() {
  const [a, e, p, ref, raw] = await Promise.all([
    listArtworks(),
    listEvents(),
    listProjects(),
    listReferences(),
    listRawWorks(),
  ]);
  return {
    artworks: a.length,
    events: e.length,
    projects: p.length,
    references: ref.length,
    rawWorks: raw.length,
  };
}

export default function AdminDashboard() {
  const { user, firebaseReady } = useAuth();
  const [counts, setCounts] = useState<{
    artworks: number | null;
    events: number | null;
    projects: number | null;
    references: number | null;
    rawWorks: number | null;
  }>({
    artworks: null,
    events: null,
    projects: null,
    references: null,
    rawWorks: null,
  });

  useEffect(() => {
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const next = await loadCounts();
        if (!cancelled) setCounts(next);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user]);

  const stats = [
    { label: "Œuvres", value: counts.artworks, href: "/admin/oeuvres" },
    { label: "Projets", value: counts.projects, href: "/admin/projets" },
    {
      label: "Expositions & Évènements",
      value: counts.events,
      href: "/admin/evenements",
    },
    { label: "Travail brut", value: counts.rawWorks, href: "/admin/travail-brut" },
    { label: "Références", value: counts.references, href: "/admin/references" },
  ];

  return (
    <>
      <AdminHeader
        eyebrow="Espace privé"
        title="Tableau de bord"
        description="Gérez vos œuvres, projets, évènements, le hero et le contenu du site."
      />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group border border-black/10 bg-white p-8 transition-colors hover:bg-neutral-50"
          >
            <p className="eyebrow">{s.label}</p>
            <p className="mt-4 font-display text-5xl">
              {s.value === null ? "—" : s.value}
            </p>
            <p className="mt-6 text-xs uppercase tracking-wide-xl text-neutral-500 group-hover:text-black">
              Gérer →
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <p className="eyebrow">Raccourcis</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/oeuvres/nouvelle"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Nouvelle œuvre
          </Link>
          <Link
            href="/admin/projets/nouveau"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Nouveau projet
          </Link>
          <Link
            href="/admin/evenements/nouveau"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Nouvel évènement
          </Link>
          <Link
            href="/admin/travail-brut/nouveau"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Travail brut
          </Link>
          <Link
            href="/admin/references/nouveau"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Référence
          </Link>
          <Link
            href="/admin/hero"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            Modifier le hero
          </Link>
          <Link
            href="/admin/site"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            Contenu du site
          </Link>
        </div>
      </section>
    </>
  );
}
