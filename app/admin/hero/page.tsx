"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUploader from "@/components/admin/ImageUploader";
import { useAuth } from "@/components/AuthProvider";
import { getHero, setHero } from "@/lib/firestore";
import { DEFAULT_HERO } from "@/lib/types";
import type { HeroSettings } from "@/lib/types";

export default function AdminHeroPage() {
  const { user, firebaseReady } = useAuth();
  const [hero, setHeroState] = useState<HeroSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const h = await getHero();
        if (!cancelled) setHeroState(h);
      } catch (err) {
        console.error(err);
        if (!cancelled) setHeroState(DEFAULT_HERO);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hero) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await setHero(hero);
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
          description="Image de fond et textes affichés en haut de la page d'accueil."
        />
        <p className="text-sm text-neutral-500">Chargement…</p>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Accueil"
        title="Hero / Image d'accueil"
        description="Image de fond et textes affichés en haut de la page d'accueil."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 md:grid-cols-[1.2fr_1fr]"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="eyebrow block">
              Titre principal
            </label>
            <input
              id="title"
              type="text"
              required
              value={hero.title}
              onChange={(e) =>
                setHeroState({ ...hero, title: e.target.value })
              }
              className="input-line mt-2"
            />
          </div>
          <div>
            <label htmlFor="subtitle" className="eyebrow block">
              Sous-titre
            </label>
            <input
              id="subtitle"
              type="text"
              value={hero.subtitle}
              onChange={(e) =>
                setHeroState({ ...hero, subtitle: e.target.value })
              }
              className="input-line mt-2"
            />
          </div>
          <div>
            <label htmlFor="description" className="eyebrow block">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={hero.description}
              onChange={(e) =>
                setHeroState({ ...hero, description: e.target.value })
              }
              className="input-line mt-2 resize-none"
            />
          </div>

          <ImageUploader
            folder="hero"
            value={
              hero.imageUrl
                ? { url: hero.imageUrl, path: hero.imagePath }
                : undefined
            }
            onChange={(value) =>
              setHeroState({
                ...hero,
                imageUrl: value?.url ?? DEFAULT_HERO.imageUrl,
                imagePath: value?.path,
              })
            }
            label="Image de fond"
            aspect="landscape"
          />

          {status && (
            <p className="text-sm text-neutral-700">{status}</p>
          )}
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

        {/* Live preview */}
        <div>
          <p className="eyebrow mb-3">Aperçu</p>
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-black/10">
            {hero.imageUrl && (
              <Image
                src={hero.imageUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <p className="text-[10px] uppercase tracking-wide-xl text-white/70">
                Galerie de l&apos;artiste
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight">
                {hero.title}
              </h2>
              <p className="font-display text-2xl text-white/80">
                {hero.subtitle}
              </p>
              <p className="mt-4 text-sm text-white/85">{hero.description}</p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
