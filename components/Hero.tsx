"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { getHero } from "@/lib/firestore";
import {
  ARTIST_NAME,
  HERO_DESCRIPTION,
  HERO_EYEBROW,
  HERO_TAGLINE_LINE1,
  HERO_TAGLINE_LINE2,
} from "@/lib/brand";
import { getLocalHeroFallback, normalizeHeroSettings } from "@/lib/hero";
import { DEFAULT_HERO_SLIDES } from "@/lib/types";
import type { HeroSettings } from "@/lib/types";

function slideSrc(url: string | undefined, index: number): string {
  if (url?.startsWith("/images/") || url?.startsWith("http")) return url;
  return DEFAULT_HERO_SLIDES[index]?.imageUrl ?? "/images/portrait_0.jpeg";
}

const SLIDE_INTERVAL_MS = 8000;
const FADE_DURATION_MS = 2400;

export default function Hero() {
  const [hero, setHero] = useState<HeroSettings>(getLocalHeroFallback());
  const [index, setIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const prevIndexRef = useRef(0);

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
    const prev = prevIndexRef.current;
    if (prev === index) return;
    setLeavingIndex(prev);
    prevIndexRef.current = index;
    const t = window.setTimeout(() => setLeavingIndex(null), FADE_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    slides.forEach((slide, i) => {
      const img = new window.Image();
      img.src = slideSrc(slide.imageUrl, i);
    });
  }, [slides]);

  const isTransitioning = leavingIndex !== null;

  const goTo = useCallback(
    (i: number) => {
      if (i === index || isTransitioning) return;
      setIndex(i);
    },
    [index, isTransitioning]
  );

  return (
    <>
      {/* Fond fixe plein écran (comme l’ancien bg-hero-fixed) — visible sous les sections sans fond opaque */}
      <div
        className="hero-slider-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-900 max-md:absolute max-md:inset-0 max-md:h-[100dvh] max-md:z-0"
        style={
          {
            "--hero-slide-duration": `${SLIDE_INTERVAL_MS}ms`,
            "--hero-fade-duration": `${FADE_DURATION_MS}ms`,
          } as CSSProperties
        }
        aria-hidden
      >
        {slides.map((slide, i) => {
          const isIncoming = i === index;
          const isOutgoing = i === leavingIndex && !isIncoming;
          return (
            <div
              key={`${slide.imageUrl}-${i}`}
              className={`hero-slide-layer ${isIncoming ? "hero-slide-layer--in" : ""} ${
                isOutgoing ? "hero-slide-layer--out" : ""
              }`}
              aria-hidden={!isIncoming && !isOutgoing}
            >
              <div className="hero-slide-media">
                <img
                  src={slideSrc(slide.imageUrl, i)}
                  alt=""
                  decoding="async"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="hero-slide-image"
                  onError={(e) => {
                    const fallback = slideSrc(undefined, i);
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
        <div className="hero-slider-overlay" />
      </div>

      {/* Zone texte hero (fond transparent, le slider reste visible derrière) */}
      <section className="relative z-10 flex min-h-[75vh] items-end text-white md:min-h-[80vh]">
        <div className="container-page pb-12 md:pb-14" suppressHydrationWarning>
          <p className="hero-eyebrow" suppressHydrationWarning>
            {HERO_EYEBROW}
          </p>
          <h1 className="hero-title" suppressHydrationWarning>
            {ARTIST_NAME}
          </h1>
          <p className="hero-tagline" suppressHydrationWarning>
            <span className="block">{HERO_TAGLINE_LINE1}</span>
            <span className="block lowercase">{HERO_TAGLINE_LINE2}</span>
          </p>
          <p className="hero-description" suppressHydrationWarning>
            {heroSafe.description || HERO_DESCRIPTION}
          </p>

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
