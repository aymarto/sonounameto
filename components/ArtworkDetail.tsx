"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ArtworkGallery from "@/components/ArtworkGallery";
import { getStaticArtwork } from "@/lib/data";
import { getArtworkImages } from "@/lib/artworks";
import { getArtwork } from "@/lib/firestore";
import { formatDate } from "@/lib/format";
import type { Artwork } from "@/lib/types";

type Props = {
  id: string;
  initialArtwork?: Artwork | null;
};

export default function ArtworkDetail({ id, initialArtwork }: Props) {
  const [artwork, setArtwork] = useState<Artwork | null | undefined>(
    initialArtwork !== undefined ? initialArtwork : undefined
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const fromDb = await getArtwork(id);
        if (!cancelled && fromDb) {
          setArtwork(fromDb);
          return;
        }
      } catch {
        // Firestore indisponible
      }

      if (!cancelled && initialArtwork === undefined) {
        setArtwork(getStaticArtwork(id) ?? null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, initialArtwork]);

  if (artwork === undefined) {
    return (
      <section className="page-content">
        <div className="container-page animate-pulse">
          <div className="h-4 w-32 bg-neutral-200" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="aspect-[4/5] bg-neutral-200 md:aspect-[3/4]" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-neutral-200" />
              <div className="h-4 w-1/4 bg-neutral-200" />
              <div className="h-24 bg-neutral-100" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (artwork === null) {
    return (
      <section className="page-content">
        <div className="container-page max-w-lg">
          <p className="eyebrow">Galerie</p>
          <h1 className="section-title mt-2">Œuvre introuvable</h1>
          <p className="mt-3 text-neutral-600">
            Cette œuvre n&apos;existe pas ou a été retirée de la galerie.
          </p>
          <Link href="/oeuvres" className="btn-line mt-6 inline-flex">
            Retour aux œuvres
          </Link>
        </div>
      </section>
    );
  }

  const images = getArtworkImages(artwork);

  return (
    <section className="page-content">
      <div className="container-page">
        <Link
          href="/oeuvres"
          className="text-xs uppercase tracking-wide-xl text-neutral-500 transition-colors hover:text-black"
        >
          ← Retour à la galerie
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
          <ArtworkGallery images={images} title={artwork.title} />

          <div>
            <p className="eyebrow">Œuvre</p>
            <h1 className="section-title mt-2">{artwork.title}</h1>
            <p className="mt-2 text-xs uppercase tracking-wide-xl text-neutral-500">
              {formatDate(artwork.date)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              {artwork.shortDescription}
            </p>

            {artwork.description && (
              <div className="mt-4 text-neutral-700 leading-relaxed">
                <p>{artwork.description}</p>
              </div>
            )}

            {(artwork.medium || artwork.dimensions) && (
              <dl className="mt-6 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-2">
                {artwork.medium && (
                  <div>
                    <dt className="eyebrow">Médium</dt>
                    <dd className="mt-2 text-sm">{artwork.medium}</dd>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <dt className="eyebrow">Dimensions</dt>
                    <dd className="mt-2 text-sm">{artwork.dimensions}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-6 flex flex-wrap gap-5">
              <Link href="/contact" className="btn-line">
                Demander des informations
              </Link>
              <Link
                href="/oeuvres"
                className="text-xs uppercase tracking-wide-xl text-neutral-500 hover:text-black"
              >
                Voir toutes les œuvres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



