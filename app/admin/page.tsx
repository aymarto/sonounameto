"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/components/AuthProvider";
import { listArtworks, listEvents } from "@/lib/firestore";

export default function AdminDashboard() {
  const { user, firebaseReady } = useAuth();
  const [counts, setCounts] = useState<{
    artworks: number | null;
    events: number | null;
  }>({ artworks: null, events: null });

  useEffect(() => {
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const [a, e] = await Promise.all([listArtworks(), listEvents()]);
        if (!cancelled) {
          setCounts({ artworks: a.length, events: e.length });
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user]);

  const stats = [
    { label: "Œuvres", value: counts.artworks, href: "/admin/galerie" },
    { label: "Évènements", value: counts.events, href: "/admin/evenements" },
  ];

  return (
    <>
      <AdminHeader
        eyebrow="Espace privé"
        title="Tableau de bord"
        description="Gérez vos œuvres, vos évènements et l'image d'accueil du site."
      />

      <section className="grid gap-6 sm:grid-cols-2">
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
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/galerie/nouvelle"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Nouvelle œuvre
          </Link>
          <Link
            href="/admin/evenements/nouveau"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            + Nouvel évènement
          </Link>
          <Link
            href="/admin/hero"
            className="border border-black/10 bg-white p-6 text-sm hover:bg-neutral-50"
          >
            Modifier le hero
          </Link>
        </div>
      </section>
    </>
  );
}
