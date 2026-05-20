"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { DisplayImage } from "@/lib/artworks";

type Props = {
  images: DisplayImage[];
  title: string;
};

export default function ArtworkGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const active = images[activeIndex] ?? images[0];

  const goTo = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setZooming(false);
  }, [activeIndex]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setZoomOrigin({
        x: Math.min(
          100,
          Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
        ),
        y: Math.min(
          100,
          Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)
        ),
      });
    },
    []
  );

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-neutral-200 md:aspect-[3/4]"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: zooming ? "scale(2.25)" : "scale(1)",
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
          }}
        >
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            quality={80}
            priority
            className="object-cover"
          />
        </div>

        <span
          className="pointer-events-none absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M16 16l5 5" />
            <path strokeLinecap="round" d="M8 11h6M11 8v6" />
          </svg>
        </span>
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]"
          role="tablist"
          aria-label={`Galerie — ${title}`}
        >
          {images.map((img, index) => (
            <button
              key={`thumb-${index}-${img.url}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Image ${index + 1}`}
              onClick={() => goTo(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 bg-neutral-200 transition-opacity sm:h-20 sm:w-20 ${
                index === activeIndex
                  ? "border-ink opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="80px"
                quality={50}
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
