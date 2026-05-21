"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPublishBadge from "@/components/admin/AdminPublishBadge";
import { useAuth } from "@/components/AuthProvider";
import { subscribeArtworks, updateArtwork } from "@/lib/firestore";
import { formatDate } from "@/lib/format";
import type { Artwork } from "@/lib/types";

export default function AdminOeuvresPage() {
  const { user, firebaseReady } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeArtworks((rows) => setArtworks(rows));
    return () => unsub();
  }, [firebaseReady, user]);

  async function handleTogglePublished(art: Artwork) {
    setTogglingId(art.id);
    try {
      await updateArtwork(art.id, { published: !(art.published !== false) });
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <AdminHeader
        eyebrow="Œuvres"
        title="Mes œuvres"
        description="Liste de toutes les œuvres présentées sur le site."
        action={{ href: "/admin/oeuvres/nouvelle", label: "+ Nouvelle œuvre" }}
      />

      {artworks === null ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : artworks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => (
            <li key={art.id}>
              <div className="border border-black/10 bg-white transition-colors hover:bg-neutral-50">
                <Link
                  href={`/admin/oeuvres/edit?id=${art.id}`}
                  className="group block"
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
                    <div className="absolute right-2 top-2 z-10">
                      <AdminPublishBadge published={art.published} />
                    </div>
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
                <div className="flex items-center justify-end gap-3 border-t border-black/10 px-4 py-3">
                  <button
                    type="button"
                    disabled={togglingId === art.id}
                    onClick={() => handleTogglePublished(art)}
                    className="text-xs uppercase tracking-wide-xl text-neutral-700 underline-offset-2 hover:text-black hover:underline disabled:opacity-50"
                  >
                    {togglingId === art.id
                      ? "…"
                      : art.published === false
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

function EmptyState() {
  return (
    <div className="border border-dashed border-black/20 bg-white p-12 text-center">
      <p className="font-display text-2xl">Aucune œuvre pour l&apos;instant</p>
      <p className="mt-3 text-sm text-neutral-600">
        Commencez par ajouter votre première œuvre.
      </p>
      <Link
        href="/admin/oeuvres/nouvelle"
        className="btn-line mt-6 inline-flex"
      >
        + Ajouter une œuvre
      </Link>
    </div>
  );
}
