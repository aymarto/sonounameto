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
import { normalizeHeroSettings } from "@/lib/hero";
import { EMPTY_HERO, type HeroSettings } from "@/lib/types";

const SLIDE_INTERVAL_MS = 8000;
const FADE_DURATION_MS = 2400;

export default function Hero() {
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [index, setIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const prevIndexRef = useRef(0);

  const heroSafe = useMemo(
    () => normalizeHeroSettings(hero ?? EMPTY_HERO),
    [hero]
  );
  const slides = heroSafe.slides;
  const slideCount = slides.length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fromDb = await getHero();
        if (!cancelled) setHero(fromDb ? normalizeHeroSettings(fromDb) : null);
      } catch {
        if (!cancelled) setHero(null);
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
    slides.forEach((slide) => {
      if (!slide.imageUrl) return;
      const img = new window.Image();
      img.src = slide.imageUrl;
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
                  src={slide.imageUrl}
                  alt=""
                  decoding="async"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="hero-slide-image"
                />
              </div>
            </div>
          );
        })}
        <div className="hero-slider-overlay" />
      </div>

      <section className="relative z-10 flex min-h-[75vh] items-end text-white md:min-h-[80vh]">
        <div className="container-page pb-12 md:pb-14" suppressHydrationWarning>
          {heroSafe.eyebrow && (
            <p className="hero-eyebrow" suppressHydrationWarning>
              {heroSafe.eyebrow}
            </p>
          )}
          {heroSafe.artistName && (
            <h1 className="hero-title" suppressHydrationWarning>
              {heroSafe.artistName}
            </h1>
          )}
          {(heroSafe.taglineLine1 || heroSafe.taglineLine2) && (
            <p className="hero-tagline" suppressHydrationWarning>
              {heroSafe.taglineLine1 && (
                <span className="block">{heroSafe.taglineLine1}</span>
              )}
              {heroSafe.taglineLine2 && (
                <span className="block lowercase">{heroSafe.taglineLine2}</span>
              )}
            </p>
          )}
          {heroSafe.description && (
            <p className="hero-description" suppressHydrationWarning>
              {heroSafe.description}
            </p>
          )}

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
