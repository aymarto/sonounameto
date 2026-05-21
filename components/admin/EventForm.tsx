"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import PublishField from "@/components/admin/PublishField";
import { createEvent, deleteEvent, updateEvent } from "@/lib/firestore";
import { deleteImage } from "@/lib/storage";
import type { ArtEvent, EventCategory } from "@/lib/types";

type Props = {
  initial?: ArtEvent;
};

export default function EventForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState<{ url: string; path?: string } | null>(
    initial?.imageUrl
      ? { url: initial.imageUrl, path: initial.imagePath }
      : null
  );
  const [published, setPublished] = useState(initial?.published !== false);
  const [category, setCategory] = useState<EventCategory>(
    initial?.category === "evenement" ? "evenement" : "exposition"
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        location: location.trim(),
        startDate,
        ...(endDate ? { endDate } : {}),
        description: description.trim(),
        category,
        published,
        ...(image?.url
          ? {
              imageUrl: image.url,
              ...(image.path ? { imagePath: image.path } : {}),
            }
          : {}),
      };
      if (isEdit && initial) {
        await updateEvent(initial.id, payload);
      } else {
        await createEvent(payload);
      }
      router.push("/admin/evenements");
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
      await deleteEvent(initial.id);
      if (initial.imagePath) {
        deleteImage(initial.imagePath).catch(() => {});
      }
      router.push("/admin/evenements");
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
        folder="events"
        value={image ?? undefined}
        onChange={setImage}
        label="Image (optionnelle)"
        aspect="landscape"
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
          <label htmlFor="category" className="eyebrow block">
            Catégorie
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as EventCategory)
            }
            className="input-line mt-2"
          >
            <option value="exposition">Exposition</option>
            <option value="evenement">Évènement</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="eyebrow block">
            Lieu
          </label>
          <input
            id="location"
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Galerie Lomé, Togo"
            className="input-line mt-2"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="eyebrow block">
              Début
            </label>
            <input
              id="startDate"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-line mt-2"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="eyebrow block">
              Fin (optionnel)
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-line mt-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="eyebrow block">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-line mt-2 resize-none"
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
                : "Créer l'évènement"}
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
