"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getHero } from "@/lib/firestore";
import { getLocalHeroFallback, normalizeHeroSettings } from "@/lib/hero";
import type { HeroSettings } from "@/lib/types";

const SLIDE_INTERVAL_MS = 6000;

export default function Hero() {
  const [hero, setHero] = useState<HeroSettings>(getLocalHeroFallback());
  const [index, setIndex] = useState(0);

  const heroSafe = useMemo(() => normalizeHeroSettings(hero), [hero]);
  const slides = heroSafe.slides;
  const slideCount = slides.length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fromDb = await getHero();
        if (!cancelled) setHero(normalizeHeroSettings(fromDb));
      } catch {
        if (!cancelled) setHero(getLocalHeroFallback());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (index >= slideCount) setIndex(0);
  }, [slideCount, index]);

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  return (
    <>
      {/* Fond fixe plein écran (comme l’ancien bg-hero-fixed) — visible sous les sections sans fond opaque */}
      <div
        className="hero-slider-bg pointer-events-none fixed inset-0 -z-10 bg-neutral-900 max-md:absolute max-md:inset-0 max-md:h-[100dvh] max-md:z-0"
        aria-hidden
      >
        {slides.map((slide, i) => (
          <div
            key={`${slide.imageUrl}-${i}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt=""
              fill
              sizes="100vw"
              quality={80}
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Zone texte hero (fond transparent, le slider reste visible derrière) */}
      <section className="relative z-10 flex min-h-[75vh] items-end text-white md:min-h-[80vh]">
        <div className="container-page pb-12 md:pb-14">
          <p className="eyebrow text-white/80">Galerie de l&apos;artiste</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {heroSafe.title}
            <span className="mt-2 block font-display text-3xl text-white/85 md:text-4xl">
              {heroSafe.subtitle}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {heroSafe.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-5">
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm uppercase tracking-wide-xl text-white transition-opacity hover:opacity-70"
            >
              Voir la galerie
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-wide-xl text-white/80 transition-opacity hover:opacity-70"
            >
              Me contacter
            </Link>
          </div>

          {slides.length > 1 && (
            <div
              className="mt-6 flex gap-2"
              role="tablist"
              aria-label="Diaporama accueil"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-px transition-all ${
                    i === index
                      ? "w-10 bg-white"
                      : "w-6 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
