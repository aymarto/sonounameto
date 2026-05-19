import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { artworks } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { hasMultipleImages } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Ma galerie — SONOUNAMETO",
  description:
    "Découvrez la galerie complète des œuvres de l'artiste SONOUNAMETO.",
};

export default function GaleriePage() {
  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title="Ma galerie"
        description="Une sélection d'œuvres : portraits, séries et études. Cliquez sur une œuvre pour voir le détail et toutes les images."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container-page grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => (
            <Link
              key={art.id}
              href={`/galerie/${art.id}`}
              className="group flex flex-col"
            >
              <article className="flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {hasMultipleImages(art) && (
                    <span className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wide-xl text-white">
                      + photos
                    </span>
                  )}
                </div>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-2xl leading-tight group-hover:opacity-70">
                      {art.title}
                    </h2>
                    <span className="shrink-0 text-xs uppercase tracking-wide-xl text-neutral-500">
                      {formatDate(art.date)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    {art.shortDescription}
                  </p>
                  {(art.medium || art.dimensions) && (
                    <p className="mt-3 text-xs uppercase tracking-wide-xl text-neutral-500">
                      {[art.medium, art.dimensions].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
