"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/components/AuthProvider";
import { subscribeArtworks } from "@/lib/firestore";
import { formatDate } from "@/lib/format";
import type { Artwork } from "@/lib/types";

export default function AdminGaleriePage() {
  const { user, firebaseReady } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeArtworks((rows) => setArtworks(rows));
    return () => unsub();
  }, [firebaseReady, user]);

  return (
    <>
      <AdminHeader
        eyebrow="Galerie"
        title="Mes œuvres"
        description="Liste de toutes les œuvres présentées sur le site."
        action={{ href: "/admin/galerie/nouvelle", label: "+ Nouvelle œuvre" }}
      />

      {artworks === null ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : artworks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => (
            <li key={art.id}>
              <Link
                href={`/admin/galerie/${art.id}`}
                className="group block border border-black/10 bg-white transition-colors hover:bg-neutral-50"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                  {art.imageUrl && (
                    <Image
                      src={art.imageUrl}
                      alt={art.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">
                      {art.title}
                    </h3>
                    <span className="shrink-0 text-[10px] uppercase tracking-wide-xl text-neutral-500">
                      {art.date ? formatDate(art.date) : "—"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                    {art.shortDescription}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-black/20 bg-white p-12 text-center">
      <p className="font-display text-2xl">Aucune œuvre pour l&apos;instant</p>
      <p className="mt-3 text-sm text-neutral-600">
        Commencez par ajouter votre première œuvre.
      </p>
      <Link
        href="/admin/galerie/nouvelle"
        className="btn-line mt-6 inline-flex"
      >
        + Ajouter une œuvre
      </Link>
    </div>
  );
}
