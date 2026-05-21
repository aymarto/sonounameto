"use client";

import { useRef, useState } from "react";
import { deleteImage, uploadFile } from "@/lib/storage";

type Props = {
  value?: { url: string; path?: string; name?: string };
  onChange: (value: { url: string; path?: string; name?: string } | null) => void;
  label?: string;
};

export default function PdfUploader({
  value,
  onChange,
  label = "Portfolio PDF",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.");
      return;
    }

    setError(null);
    setProgress(0);
    try {
      const result = await uploadFile(file, "portfolio", (p) =>
        setProgress(Math.round(p * 100))
      );
      if (value?.path && value.path !== result.path) {
        deleteImage(value.path).catch(() => {});
      }
      onChange({ url: result.url, path: result.path, name: file.name });
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
      <div className="rounded border border-dashed border-black/30 bg-neutral-50 px-4 py-5">
        {value?.url ? (
          <div className="space-y-2 text-sm">
            <p className="font-medium">{value.name ?? "portfolio.pdf"}</p>
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-line inline-flex"
            >
              Voir le PDF
            </a>
          </div>
        ) : (
          <p className="text-xs uppercase tracking-wide-xl text-neutral-400">
            Aucun PDF
          </p>
        )}

        {progress !== null && (
          <p className="mt-3 text-xs uppercase tracking-wide-xl">
            Envoi… {progress}%
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
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
          {value?.url ? "Remplacer le PDF" : "Choisir un PDF"}
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
