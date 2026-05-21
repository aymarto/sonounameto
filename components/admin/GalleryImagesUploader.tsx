"use client";

import { useRef, useState } from "react";
import { uploadImage, deleteImage } from "@/lib/storage";
import type { ArtworkImage } from "@/lib/types";

type Props = {
  images: ArtworkImage[];
  onChange: (images: ArtworkImage[]) => void;
};

export default function GalleryImagesUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);
    setUploading(true);

    const added: ArtworkImage[] = [];

    try {
      for (const file of Array.from(fileList)) {
        const result = await uploadImage(file, "artworks");
        added.push({ url: result.url, path: result.path });
      }
      onChange([...images, ...added]);
    } catch (err) {
      console.error(err);
      setError("Échec de l'upload d'une ou plusieurs images.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    const removed = images[index];
    if (removed?.path) {
      deleteImage(removed.path).catch(() => {});
    }
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="eyebrow mb-2">Images supplémentaires</p>
      <p className="mb-4 text-xs text-neutral-500">
        Vues détaillées, détails, variations… Affichées sur la page de l&apos;œuvre.
      </p>

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="relative aspect-square overflow-hidden border border-black/10 bg-neutral-50"
            >
              <img
                src={img.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 bg-black/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide-xl text-white hover:bg-black"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn-line disabled:opacity-50"
      >
        {uploading ? "Envoi en cours…" : "+ Ajouter des images"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
