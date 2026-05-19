"use client";

import Image from "next/image";
import { useState } from "react";
import type { DisplayImage } from "@/lib/artworks";

type Props = {
  images: DisplayImage[];
  title: string;
};

export default function ArtworkGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 md:aspect-[3/4]">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:gap-3">
          {images.map((img, index) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? "border-ink"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`${title} — image ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
