"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage, deleteImage } from "@/lib/storage";

type Props = {
  folder: "artworks" | "events" | "hero";
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

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "landscape"
      ? "aspect-[4/3]"
      : "aspect-[3/4]";

  async function handleFile(file: File) {
    setError(null);
    setProgress(0);
    try {
      const result = await uploadImage(file, folder, (p) =>
        setProgress(Math.round(p * 100))
      );
      // Best-effort cleanup of previous file
      if (value?.path && value.path !== result.path) {
        deleteImage(value.path).catch(() => {});
      }
      onChange({ url: result.url, path: result.path });
    } catch (err) {
      console.error(err);
      setError("L'upload a échoué.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (value?.path) {
      deleteImage(value.path).catch(() => {});
    }
    onChange(null);
  }

  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div
        className={`relative ${aspectClass} w-full overflow-hidden border border-dashed border-black/30 bg-neutral-50`}
      >
        {value?.url ? (
          <Image
            src={value.url}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wide-xl text-neutral-400">
            Aucune image
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

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
