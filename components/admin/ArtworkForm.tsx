"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createArtwork,
  deleteArtwork,
  updateArtwork,
} from "@/lib/firestore";
import { deleteImage } from "@/lib/storage";
import type { Artwork } from "@/lib/types";

type Props = {
  initial?: Artwork;
};

export default function ArtworkForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    initial?.shortDescription ?? ""
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [medium, setMedium] = useState(initial?.medium ?? "");
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? "");
  const [image, setImage] = useState<{ url: string; path?: string } | null>(
    initial?.imageUrl
      ? { url: initial.imageUrl, path: initial.imagePath }
      : null
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!image?.url) {
      setError("Une image est requise.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        date,
        medium: medium.trim() || undefined,
        dimensions: dimensions.trim() || undefined,
        imageUrl: image.url,
        imagePath: image.path,
      };

      if (isEdit && initial) {
        await updateArtwork(initial.id, payload);
      } else {
        await createArtwork(payload);
      }
      router.push("/admin/galerie");
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
      await deleteArtwork(initial.id);
      if (initial.imagePath) {
        deleteImage(initial.imagePath).catch(() => {});
      }
      router.push("/admin/galerie");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Suppression impossible.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
      <ImageUploader
        folder="artworks"
        value={image ?? undefined}
        onChange={setImage}
        label="Image principale"
        aspect="portrait"
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="eyebrow block">
            Titre
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-line mt-2"
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="eyebrow block">
            Description courte
          </label>
          <input
            id="shortDescription"
            type="text"
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Ex. Portrait à l'huile, 2024."
            className="input-line mt-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="eyebrow block">
            Description longue
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-line mt-2 resize-none"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="eyebrow block">
              Date de réalisation
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-line mt-2"
            />
          </div>
          <div>
            <label htmlFor="medium" className="eyebrow block">
              Médium
            </label>
            <input
              id="medium"
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="Huile sur toile"
              className="input-line mt-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dimensions" className="eyebrow block">
            Dimensions
          </label>
          <input
            id="dimensions"
            type="text"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="80 × 100 cm"
            className="input-line mt-2"
          />
        </div>

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
                : "Créer l'œuvre"}
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
