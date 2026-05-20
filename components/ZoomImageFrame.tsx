"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  quality?: number;
};

export function LoupeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M16 16l5 5" />
      <path strokeLinecap="round" d="M8 11h6M11 8v6" />
    </svg>
  );
}

export default function ZoomImageFrame({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  quality = 80,
}: Props) {
  const [zooming, setZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

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

  return (
    <div
      className={`group relative h-full w-full cursor-zoom-in overflow-hidden ${className}`}
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
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          className="object-cover"
        />
      </div>
      <span className="pointer-events-none absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:right-3 sm:top-3 sm:h-10 sm:w-10">
        <LoupeIcon />
      </span>
    </div>
  );
}
