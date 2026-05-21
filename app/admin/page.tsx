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
import type { MigrationResult } from "@/lib/migration/types";
import { runStaticMigration } from "@/lib/migrate-static-firestore";

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
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(
    null
  );
  const [migrationError, setMigrationError] = useState<string | null>(null);

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

  async function handleMigrateStatic() {
    if (!user) return;
    const ok = window.confirm(
      "Migrer les données statiques ?\n\n" +
        "1. Copie les images de public/images/ vers public/uploads/\n" +
        "2. Met à jour Firestore avec les nouvelles URLs\n\n" +
        "Les documents existants avec les mêmes IDs seront écrasés."
    );
    if (!ok) return;

    setMigrating(true);
    setMigrationError(null);
    setMigrationResult(null);
    try {
      const token = await user.getIdToken();
      const result = await runStaticMigration(token);
      setMigrationResult(result);
      setCounts(await loadCounts());
    } catch (err) {
      console.error(err);
      setMigrationError(
        err instanceof Error ? err.message : "Migration impossible."
      );
    } finally {
      setMigrating(false);
    }
  }

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

      <section className="mt-12 border border-black/10 bg-white p-6 md:p-8">
        <p className="eyebrow">Migration</p>
        <h2 className="section-title mt-2 text-2xl">
          Données statiques → uploads + Firebase
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Copie les images de démo depuis{" "}
          <code className="bg-neutral-100 px-1">public/images/</code> vers{" "}
          <code className="bg-neutral-100 px-1">public/uploads/</code>, puis
          enregistre le contenu (œuvres, projets, évènements, références,
          travail brut, hero, site) dans Firestore avec les nouvelles URLs.
        </p>
        <button
          type="button"
          onClick={handleMigrateStatic}
          disabled={migrating || !firebaseReady || !user}
          className="btn-line mt-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {migrating ? "Migration en cours…" : "Lancer la migration"}
        </button>
        {migrationResult && (
          <p className="mt-4 text-sm text-green-800">
            Migration réussie — {migrationResult.imagesCopied} image
            {migrationResult.imagesCopied > 1 ? "s" : ""} copiée
            {migrationResult.imagesCopied > 1 ? "s" : ""},{" "}
            {migrationResult.artworks} œuvres, {migrationResult.events}{" "}
            évènements, {migrationResult.projects} projets,{" "}
            {migrationResult.references} références, {migrationResult.rawWorks}{" "}
            travail brut, {migrationResult.settings} réglages.
            {migrationResult.missingImages.length > 0 && (
              <>
                {" "}
                Images introuvables :{" "}
                {migrationResult.missingImages.join(", ")}
              </>
            )}
          </p>
        )}
        {migrationError && (
          <p className="mt-4 text-sm text-red-700">{migrationError}</p>
        )}
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
