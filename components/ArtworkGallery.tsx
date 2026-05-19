"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { DisplayImage } from "@/lib/artworks";

type Props = {
  images: DisplayImage[];
  title: string;
};

function shouldLoadThumb(index: number, activeIndex: number): boolean {
  if (index === 0) return true;
  return Math.abs(index - activeIndex) <= 1;
}

export default function ArtworkGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200 md:aspect-[3/4]">
        <Image
          src={active.url}
          alt={active.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          quality={75}
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]"
          role="tablist"
          aria-label={`Galerie — ${title}`}
        >
          {images.map((img, index) => (
            <button
              key={img.url}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => goTo(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-neutral-200 sm:h-20 sm:w-20 ${
                index === activeIndex
                  ? "border-ink"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {shouldLoadThumb(index, activeIndex) ? (
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  quality={40}
                  loading="lazy"
                  className="object-cover"
                />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
