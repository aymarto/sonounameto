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
};

export default function ArtworkDetail({ id }: Props) {
  const [artwork, setArtwork] = useState<Artwork | null | undefined>(undefined);

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
        // Firestore indisponible → données statiques
      }

      if (!cancelled) {
        setArtwork(getStaticArtwork(id) ?? null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (artwork === undefined) {
    return (
      <section className="bg-white py-24">
        <div className="container-page">
          <p className="text-sm text-neutral-500">Chargement de l&apos;œuvre…</p>
        </div>
      </section>
    );
  }

  if (artwork === null) {
    return (
      <section className="bg-white py-24">
        <div className="container-page max-w-lg">
          <p className="eyebrow">Galerie</p>
          <h1 className="section-title mt-3">Œuvre introuvable</h1>
          <p className="mt-4 text-neutral-600">
            Cette œuvre n&apos;existe pas ou a été retirée de la galerie.
          </p>
          <Link href="/galerie" className="btn-line mt-8 inline-flex">
            Retour à la galerie
          </Link>
        </div>
      </section>
    );
  }

  const images = getArtworkImages(artwork);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container-page">
        <Link
          href="/galerie"
          className="text-xs uppercase tracking-wide-xl text-neutral-500 transition-colors hover:text-black"
        >
          ← Retour à la galerie
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ArtworkGallery images={images} title={artwork.title} />

          <div>
            <p className="eyebrow">Œuvre</p>
            <h1 className="section-title mt-3">{artwork.title}</h1>
            <p className="mt-2 text-xs uppercase tracking-wide-xl text-neutral-500">
              {formatDate(artwork.date)}
            </p>

            <p className="mt-6 text-sm leading-relaxed text-neutral-600">
              {artwork.shortDescription}
            </p>

            {artwork.description && (
              <div className="mt-6 text-neutral-700 leading-relaxed">
                <p>{artwork.description}</p>
              </div>
            )}

            {(artwork.medium || artwork.dimensions) && (
              <dl className="mt-10 grid gap-6 border-t border-black/10 pt-8 sm:grid-cols-2">
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

            <div className="mt-10 flex flex-wrap gap-6">
              <Link href="/contact" className="btn-line">
                Demander des informations
              </Link>
              <Link
                href="/galerie"
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
