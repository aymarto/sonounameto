"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAuth } from "@/components/AuthProvider";
import { getHero, setHero } from "@/lib/firestore";
import { normalizeHeroSettings } from "@/lib/hero";
import { EMPTY_HERO } from "@/lib/types";
import type { HeroSettings } from "@/lib/types";

const SLIDE_LABELS = ["Image 1", "Image 2", "Image 3"];

function Field({
  label,
  id,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const className = "input-line mt-2 w-full resize-none";
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </div>
  );
}

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
        if (!cancelled) setHeroState(normalizeHeroSettings(h ?? EMPTY_HERO));
      } catch (err) {
        console.error(err);
        if (!cancelled) setHeroState(EMPTY_HERO);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user]);

  function patch(partial: Partial<HeroSettings>) {
    if (!hero) return;
    setHeroState({ ...hero, ...partial });
  }

  function updateSlide(
    index: number,
    value: { url: string; path?: string } | null
  ) {
    if (!hero) return;
    const slides = [...hero.slides];
    while (slides.length <= index) {
      slides.push({ imageUrl: "" });
    }
    slides[index] = {
      imageUrl: value?.url ?? "",
      ...(value?.path ? { imagePath: value.path } : {}),
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
        description="Textes et 3 images du bandeau d'accueil."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 md:grid-cols-[1.2fr_1fr]"
      >
        <div className="space-y-6">
          <div className="space-y-4 border-b border-black/10 pb-8">
            <p className="eyebrow">Textes du hero</p>
            <Field
              label="Sur-titre"
              id="eyebrow"
              value={hero.eyebrow}
              onChange={(eyebrow) => patch({ eyebrow })}
            />
            <Field
              label="Nom de l'artiste"
              id="artistName"
              value={hero.artistName}
              onChange={(artistName) => patch({ artistName })}
            />
            <Field
              label="Accroche — ligne 1"
              id="taglineLine1"
              value={hero.taglineLine1}
              onChange={(taglineLine1) => patch({ taglineLine1 })}
            />
            <Field
              label="Accroche — ligne 2"
              id="taglineLine2"
              value={hero.taglineLine2}
              onChange={(taglineLine2) => patch({ taglineLine2 })}
            />
            <Field
              label="Description"
              id="description"
              value={hero.description}
              onChange={(description) => patch({ description })}
              multiline
            />
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
              <p className="hero-eyebrow">{hero.eyebrow}</p>
              <h2 className="hero-title mt-3 text-3xl normal-case">
                {hero.artistName}
              </h2>
              <p className="hero-tagline mt-3 text-xl">
                <span className="block">{hero.taglineLine1}</span>
                <span className="block lowercase">{hero.taglineLine2}</span>
              </p>
              <p className="hero-description mt-3 text-sm text-white/85">
                {hero.description}
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
