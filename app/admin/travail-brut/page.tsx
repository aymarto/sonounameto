"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPublishBadge from "@/components/admin/AdminPublishBadge";
import { useAuth } from "@/components/AuthProvider";
import { subscribeRawWorks, updateRawWork } from "@/lib/firestore-content";
import type { RawWorkImage } from "@/lib/types";

export default function AdminTravailBrutPage() {
  const { user, firebaseReady } = useAuth();
  const [rows, setRows] = useState<RawWorkImage[] | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeRawWorks((list) => setRows(list));
    return () => unsub();
  }, [firebaseReady, user]);

  async function handleTogglePublished(r: RawWorkImage) {
    setTogglingId(r.id);
    try {
      await updateRawWork(r.id, { published: !(r.published !== false) });
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <AdminHeader
        eyebrow="Travail brut"
        title="Travail brut"
        description="Croquis, essais et images hors cadre exposées dans la section dédiée."
        action={{
          href: "/admin/travail-brut/nouveau",
          label: "+ Nouvelle image",
        }}
      />

      {rows === null ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-black/20 bg-white p-12 text-center">
          <p className="font-display text-2xl">Aucune image</p>
          <p className="mt-3 text-sm text-neutral-600">
            Ajoutez une première image de travail brut.
          </p>
          <Link
            href="/admin/travail-brut/nouveau"
            className="btn-line mt-6 inline-flex"
          >
            + Nouvelle image
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="border border-black/10 bg-white transition-colors hover:bg-neutral-50">
                <Link
                  href={`/admin/travail-brut/edit?id=${r.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                    {r.imageUrl && (
                      <Image
                        src={r.imageUrl}
                        alt={r.alt ?? ""}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute right-2 top-2 z-10">
                      <AdminPublishBadge published={r.published} />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-neutral-600">
                      {r.alt || "Sans légende"}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center justify-end gap-3 border-t border-black/10 px-4 py-3">
                  <button
                    type="button"
                    disabled={togglingId === r.id}
                    onClick={() => handleTogglePublished(r)}
                    className="text-xs uppercase tracking-wide-xl text-neutral-700 underline-offset-2 hover:text-black hover:underline disabled:opacity-50"
                  >
                    {togglingId === r.id
                      ? "…"
                      : r.published === false
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
