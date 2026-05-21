"use client";

import CmsImage from "@/components/CmsImage";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ZoomImageFrame from "@/components/ZoomImageFrame";

type ImageItem = {
  id: string;
  imageUrl: string;
  alt?: string;
};

type Props = {
  images: ImageItem[];
};

export default function ImageOnlyGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || images.length === 0) return i;
      return (i - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || images.length === 0) return i;
      return (i + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, close, goPrev, goNext]);

  const active = lightboxIndex !== null ? images[lightboxIndex] : null;

  const lightbox =
    active && lightboxIndex !== null ? (
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/92 p-4 pt-20 sm:p-8 sm:pt-24"
        role="dialog"
        aria-modal="true"
        aria-label="Image agrandie"
        onClick={close}
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20 sm:top-6"
          aria-label="Fermer"
        >
          ×
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-3 py-4 text-white transition-colors hover:bg-white/20 sm:left-4"
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-3 py-4 text-white transition-colors hover:bg-white/20 sm:right-4"
              aria-label="Image suivante"
            >
              ›
            </button>
          </>
        )}

        <div
          className="relative h-[min(78vh,900px)] w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ZoomImageFrame
            src={active.imageUrl}
            alt={active.alt ?? "Travail brut"}
            sizes="100vw"
            quality={90}
            priority
          />
        </div>

        <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-wide-xl text-white/60">
          {lightboxIndex + 1} / {images.length}
        </p>
      </div>
    ) : null;

  return (
    <>
      <div className="container-page grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-[3/4] overflow-hidden bg-neutral-100 text-left"
            aria-label={`Agrandir l'image ${index + 1}`}
          >
            <CmsImage
              src={img.imageUrl}
              alt={img.alt ?? "Travail brut"}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              quality={75}
              priority={index < 4}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {typeof document !== "undefined" && lightbox
        ? createPortal(lightbox, document.body)
        : null}
    </>
  );
}
