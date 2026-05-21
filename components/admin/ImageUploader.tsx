"use client";

import { useRef, useState } from "react";
import { uploadImage, deleteImage } from "@/lib/storage";

type Props = {
  folder: "artworks" | "events" | "hero" | "about" | "projects" | "references" | "raw-work";
  value?: { url: string; path?: string };
  onChange: (value: { url: string; path?: string } | null) => void;
  label?: string;
  aspect?: "square" | "portrait" | "landscape";
};

export default function ImageUploader({
  folder,
  value,
  onChange,
  label = "Image",
  aspect = "portrait",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "landscape"
      ? "aspect-[4/3]"
      : "aspect-[3/4]";

  async function handleFile(file: File) {
    setError(null);
    setPreviewError(false);
    setProgress(0);
    try {
      const result = await uploadImage(file, folder, (p) =>
        setProgress(Math.round(p * 100))
      );
      if (value?.path && value.path !== result.path) {
        deleteImage(value.path).catch(() => {});
      }
      onChange({ url: result.url, path: result.path });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "L'upload a échoué.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (value?.path) {
      deleteImage(value.path).catch(() => {});
    }
    setPreviewError(false);
    onChange(null);
  }

  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div
        className={`relative ${aspectClass} w-full overflow-hidden border border-dashed border-black/30 bg-neutral-50`}
      >
        {value?.url && !previewError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs uppercase tracking-wide-xl text-neutral-400">
            {previewError ? "Aperçu indisponible" : "Aucune image"}
          </div>
        )}

        {progress !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-xs uppercase tracking-wide-xl">
            Envoi… {progress}%
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-line"
          disabled={progress !== null}
        >
          {value?.url ? "Remplacer" : "Choisir une image"}
        </button>
        {value?.url && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs uppercase tracking-wide-xl text-neutral-500 hover:text-red-600"
            disabled={progress !== null}
          >
            Supprimer
          </button>
        )}
      </div>

      {previewError && value?.url && (
        <p className="mt-2 text-sm text-amber-700">
          Fichier enregistré ({value.url}) mais l&apos;aperçu ne charge pas. Vérifiez
          que le serveur sert bien le dossier uploads.
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
