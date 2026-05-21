"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import PublishField from "@/components/admin/PublishField";
import {
  createRawWork,
  deleteRawWork,
  updateRawWork,
} from "@/lib/firestore-content";
import { deleteImage } from "@/lib/storage";
import type { RawWorkImage } from "@/lib/types";

type Props = {
  initial?: RawWorkImage;
};

export default function RawWorkForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [alt, setAlt] = useState(initial?.alt ?? "");
  const [order, setOrder] = useState(
    initial?.order !== undefined ? String(initial.order) : ""
  );
  const [published, setPublished] = useState(initial?.published !== false);
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

    const orderNum =
      order.trim() === "" ? undefined : Number.parseInt(order, 10);
    if (order.trim() !== "" && Number.isNaN(orderNum)) {
      setError("Ordre invalide.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        imageUrl: image.url,
        ...(image.path ? { imagePath: image.path } : {}),
        ...(alt.trim() ? { alt: alt.trim() } : {}),
        published,
        ...(orderNum !== undefined ? { order: orderNum } : {}),
      };

      if (isEdit && initial) {
        await updateRawWork(initial.id, payload);
      } else {
        await createRawWork(
          payload as Omit<RawWorkImage, "id" | "createdAt" | "updatedAt">
        );
      }
      router.push("/admin/travail-brut");
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
    if (!confirm("Supprimer cette image de travail brut ?")) return;
    setDeleting(true);
    try {
      await deleteRawWork(initial.id);
      if (initial.imagePath) {
        deleteImage(initial.imagePath).catch(() => {});
      }
      router.push("/admin/travail-brut");
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
        folder="raw-work"
        value={image ?? undefined}
        onChange={setImage}
        label="Image"
        aspect="portrait"
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="raw-alt" className="eyebrow block">
            Texte alternatif (optionnel)
          </label>
          <input
            id="raw-alt"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Description courte pour l’accessibilité"
            className="input-line mt-2"
          />
        </div>

        <div>
          <label htmlFor="raw-order" className="eyebrow block">
            Ordre d&apos;affichage
          </label>
          <input
            id="raw-order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Optionnel"
            className="input-line mt-2"
          />
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
                : "Ajouter l’image"}
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
