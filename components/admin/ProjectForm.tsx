"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import ImageUploader from "@/components/admin/ImageUploader";
import PublishField from "@/components/admin/PublishField";
import { subscribeArtworks } from "@/lib/firestore";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/firestore-content";
import { deleteImage } from "@/lib/storage";
import type { Artwork, Project } from "@/lib/types";

type Props = {
  initial?: Project;
};

export default function ProjectForm({ initial }: Props) {
  const router = useRouter();
  const { user, firebaseReady } = useAuth();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [order, setOrder] = useState(
    initial?.order !== undefined ? String(initial.order) : ""
  );
  const [artworkList, setArtworkList] = useState<Artwork[]>([]);
  const [artworkIds, setArtworkIds] = useState<string[]>(initial?.artworkIds ?? []);
  const [published, setPublished] = useState(initial?.published !== false);
  const [cover, setCover] = useState<{ url: string; path?: string } | null>(
    initial?.coverImageUrl
      ? { url: initial.coverImageUrl, path: initial.coverImagePath }
      : null
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    const unsub = subscribeArtworks((rows) => {
      setArtworkList([...rows].sort((a, b) => a.title.localeCompare(b.title, "fr")));
    });
    return () => unsub();
  }, [firebaseReady, user]);

  function toggleArtwork(id: string) {
    setArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!cover?.url) {
      setError("Une image de couverture est requise.");
      return;
    }

    const orderNum =
      order.trim() === "" ? undefined : Number.parseInt(order, 10);
    if (order.trim() !== "" && Number.isNaN(orderNum)) {
      setError("Ordre invalide.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        coverImageUrl: cover.url,
        ...(cover.path ? { coverImagePath: cover.path } : {}),
        artworkIds,
        published,
        ...(orderNum !== undefined ? { order: orderNum } : {}),
      };

      if (isEdit && initial) {
        await updateProject(initial.id, payload);
      } else {
        await createProject(payload);
      }
      router.push("/admin/projets");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Enregistrement impossible. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial) return;
    if (!confirm(`Supprimer définitivement « ${initial.title} » ?`)) return;
    setDeleting(true);
    try {
      await deleteProject(initial.id);
      if (initial.coverImagePath) {
        deleteImage(initial.coverImagePath).catch(() => {});
      }
      router.push("/admin/projets");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Suppression impossible.");
      setDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 md:grid-cols-[1fr_1.2fr]"
    >
      <ImageUploader
        folder="projects"
        value={cover ?? undefined}
        onChange={setCover}
        label="Image de couverture"
        aspect="landscape"
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="proj-title" className="eyebrow block">
            Titre
          </label>
          <input
            id="proj-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-line mt-2"
          />
        </div>

        <div>
          <label htmlFor="proj-description" className="eyebrow block">
            Description
          </label>
          <textarea
            id="proj-description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-line mt-2 resize-none"
          />
        </div>

        <div>
          <label htmlFor="proj-order" className="eyebrow block">
            Ordre d&apos;affichage
          </label>
          <input
            id="proj-order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Optionnel — les plus petits apparaissent en premier"
            className="input-line mt-2"
          />
        </div>

        <div>
          <p className="eyebrow mb-2">Œuvres incluses</p>
          <div className="max-h-56 space-y-2 overflow-y-auto border border-black/10 bg-neutral-50 p-3">
            {artworkList.length === 0 ? (
              <p className="text-sm text-neutral-500">Aucune œuvre chargée.</p>
            ) : (
              artworkList.map((art) => (
                <label
                  key={art.id}
                  className="flex cursor-pointer items-start gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={artworkIds.includes(art.id)}
                    onChange={() => toggleArtwork(art.id)}
                    className="mt-1 h-4 w-4 accent-black"
                  />
                  <span>{art.title}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <PublishField published={published} onChange={setPublished} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="border border-black bg-black px-6 py-3 text-xs uppercase tracking-wide-xl text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving
                ? "Enregistrement…"
                : isEdit
                ? "Enregistrer"
                : "Créer le projet"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs uppercase tracking-wide-xl text-neutral-600 hover:text-black"
            >
              Annuler
            </button>
          </div>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs uppercase tracking-wide-xl text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
