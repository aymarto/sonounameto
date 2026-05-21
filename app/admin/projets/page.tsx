"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPublishBadge from "@/components/admin/AdminPublishBadge";
import { useAuth } from "@/components/AuthProvider";
import { subscribeProjects, updateProject } from "@/lib/firestore-content";
import type { Project } from "@/lib/types";

export default function AdminProjetsPage() {
  const { user, firebaseReady } = useAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeProjects((rows) => setProjects(rows));
    return () => unsub();
  }, [firebaseReady, user]);

  async function handleTogglePublished(p: Project) {
    setTogglingId(p.id);
    try {
      await updateProject(p.id, { published: !(p.published !== false) });
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <AdminHeader
        eyebrow="Projets"
        title="Projets & séries"
        description="Regroupez des œuvres en projets présentés sur le site."
        action={{ href: "/admin/projets/nouveau", label: "+ Nouveau projet" }}
      />

      {projects === null ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-black/20 bg-white p-12 text-center">
          <p className="font-display text-2xl">Aucun projet</p>
          <p className="mt-3 text-sm text-neutral-600">
            Créez un premier projet pour lier plusieurs œuvres.
          </p>
          <Link
            href="/admin/projets/nouveau"
            className="btn-line mt-6 inline-flex"
          >
            + Nouveau projet
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <div className="border border-black/10 bg-white transition-colors hover:bg-neutral-50">
                <Link
                  href={`/admin/projets/edit?id=${p.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    {p.coverImageUrl && (
                      <Image
                        src={p.coverImageUrl}
                        alt={p.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute right-2 top-2 z-10">
                      <AdminPublishBadge published={p.published} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-xl leading-tight">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                        {p.description}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="flex items-center justify-end gap-3 border-t border-black/10 px-4 py-3">
                  <button
                    type="button"
                    disabled={togglingId === p.id}
                    onClick={() => handleTogglePublished(p)}
                    className="text-xs uppercase tracking-wide-xl text-neutral-700 underline-offset-2 hover:text-black hover:underline disabled:opacity-50"
                  >
                    {togglingId === p.id
                      ? "…"
                      : p.published === false
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
