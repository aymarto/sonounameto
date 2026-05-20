"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAuth } from "@/components/AuthProvider";
import { getHero, setHero } from "@/lib/firestore";
import {
  ARTIST_NAME,
  HERO_DESCRIPTION,
  HERO_EYEBROW,
  HERO_TAGLINE_LINE1,
  HERO_TAGLINE_LINE2,
} from "@/lib/brand";
import { normalizeHeroSettings } from "@/lib/hero";
import { DEFAULT_HERO, DEFAULT_HERO_SLIDES } from "@/lib/types";
import type { HeroSettings } from "@/lib/types";

const SLIDE_LABELS = ["Image 1", "Image 2", "Image 3"];

export default function AdminHeroPage() {
  const { user, firebaseReady } = useAuth();
  const [hero, setHeroState] = useState<HeroSettings | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const h = await getHero();
        if (!cancelled) setHeroState(normalizeHeroSettings(h));
      } catch (err) {
        console.error(err);
        if (!cancelled) setHeroState(DEFAULT_HERO);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user]);

  function updateSlide(
    index: number,
    value: { url: string; path?: string } | null
  ) {
    if (!hero) return;
    const slides = [...hero.slides];
    slides[index] = {
      imageUrl: value?.url ?? DEFAULT_HERO_SLIDES[index]?.imageUrl ?? "",
      imagePath: value?.path,
    };
    setHeroState({ ...hero, slides });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hero) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await setHero(normalizeHeroSettings(hero));
      setStatus("Modifications enregistrées.");
    } catch (err) {
      console.error(err);
      setError("Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  if (!hero) {
    return (
      <>
        <AdminHeader
          eyebrow="Accueil"
          title="Hero"
          description="Diaporama et textes de la page d'accueil."
        />
        <p className="text-sm text-neutral-500">Chargement…</p>
      </>
    );
  }

  const previewSlide = hero.slides[previewIndex] ?? hero.slides[0];

  return (
    <>
      <AdminHeader
        eyebrow="Accueil"
        title="Hero / Diaporama"
        description="3 images en rotation sur l'accueil, plus les textes affichés par-dessus."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 md:grid-cols-[1.2fr_1fr]"
      >
        <div className="space-y-6">
          <div className="rounded border border-black/10 bg-neutral-50 px-4 py-3 text-sm">
            <p className="eyebrow">Sur-titre hero</p>
            <p className="mt-1 font-display text-lg uppercase">{HERO_EYEBROW}</p>
            <p className="eyebrow mt-4">Artiste</p>
            <p className="mt-1 font-display text-xl uppercase">{ARTIST_NAME}</p>
            <p className="eyebrow mt-4">Accroche</p>
            <p className="mt-1 font-display text-lg leading-snug">
              {HERO_TAGLINE_LINE1}
              <br />
              <span className="lowercase">{HERO_TAGLINE_LINE2}</span>
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Textes fixes (sans nom de galerie). Modifiez uniquement les images
              ci-dessous.
            </p>
          </div>

          <div className="space-y-8 border-t border-black/10 pt-8">
            <p className="eyebrow">3 images du diaporama</p>
            {SLIDE_LABELS.map((label, i) => (
              <ImageUploader
                key={label}
                folder="hero"
                label={label}
                aspect="landscape"
                value={
                  hero.slides[i]?.imageUrl
                    ? {
                        url: hero.slides[i].imageUrl,
                        path: hero.slides[i].imagePath,
                      }
                    : undefined
                }
                onChange={(value) => updateSlide(i, value)}
              />
            ))}
          </div>

          {status && <p className="text-sm text-neutral-700">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-4 border-t border-black/10 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="border border-black bg-black px-6 py-3 text-xs uppercase tracking-wide-xl text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">Aperçu</p>
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-black/10 bg-neutral-900">
            {previewSlide?.imageUrl && (
              <Image
                src={previewSlide.imageUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <p className="hero-eyebrow">{HERO_EYEBROW}</p>
              <h2 className="hero-title mt-3 text-3xl normal-case">
                {ARTIST_NAME}
              </h2>
              <p className="hero-tagline mt-3 text-xl">
                <span className="block">{HERO_TAGLINE_LINE1}</span>
                <span className="block lowercase">{HERO_TAGLINE_LINE2}</span>
              </p>
              <p className="hero-description mt-3 text-sm text-white/85">
                {hero.description || HERO_DESCRIPTION}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {hero.slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPreviewIndex(i)}
                className={`h-px ${
                  i === previewIndex ? "w-8 bg-black" : "w-5 bg-neutral-300"
                }`}
                aria-label={`Aperçu image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </form>
    </>
  );
}



