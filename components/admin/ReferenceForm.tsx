"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import PublishField from "@/components/admin/PublishField";
import {
  createReference,
  deleteReference,
  updateReference,
} from "@/lib/firestore-content";
import { deleteImage } from "@/lib/storage";
import type { ReferenceItem } from "@/lib/types";

type Props = {
  initial?: ReferenceItem;
};

export default function ReferenceForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
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
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        imageUrl: image.url,
        ...(image.path ? { imagePath: image.path } : {}),
        published,
        ...(orderNum !== undefined ? { order: orderNum } : {}),
      };

      if (isEdit && initial) {
        await updateReference(initial.id, payload);
      } else {
        await createReference(
          payload as Omit<ReferenceItem, "id" | "createdAt" | "updatedAt">
        );
      }
      router.push("/admin/references");
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
      await deleteReference(initial.id);
      if (initial.imagePath) {
        deleteImage(initial.imagePath).catch(() => {});
      }
      router.push("/admin/references");
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
        folder="references"
        value={image ?? undefined}
        onChange={setImage}
        label="Image"
        aspect="square"
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="ref-title" className="eyebrow block">
            Titre
          </label>
          <input
            id="ref-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-line mt-2"
          />
        </div>

        <div>
          <label htmlFor="ref-description" className="eyebrow block">
            Description
          </label>
          <textarea
            id="ref-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-line mt-2 resize-none"
          />
        </div>

        <div>
          <label htmlFor="ref-order" className="eyebrow block">
            Ordre d&apos;affichage
          </label>
          <input
            id="ref-order"
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
                : "Créer la référence"}
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
