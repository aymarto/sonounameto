import { ARTIST_NAME, GALLERY_NAME } from "@/lib/brand";
import {
  DEFAULT_HERO,
  DEFAULT_HERO_SLIDES,
  type HeroSettings,
  type HeroSlide,
} from "@/lib/types";

/** Titre / sous-titre toujours alignés sur la marque (évite anciennes valeurs Firebase). */
function withBrandText(
  data: Partial<HeroSettings> | null | undefined,
  base: Pick<HeroSettings, "description" | "slides">
): HeroSettings {
  return {
    slides: base.slides,
    title: GALLERY_NAME,
    subtitle: ARTIST_NAME,
    description: data?.description ?? DEFAULT_HERO.description,
  };
}

/** Les 3 images locales du dossier public/images */
export function getLocalHeroSlides(): HeroSlide[] {
  return DEFAULT_HERO_SLIDES.map((s) => ({ ...s }));
}

/** Firebase a fourni au moins une image utilisable */
export function hasFirebaseSlides(data: Partial<HeroSettings> | null | undefined): boolean {
  if (!data) return false;
  if (Array.isArray(data.slides) && data.slides.some((s) => s?.imageUrl)) {
    return true;
  }
  return typeof data.imageUrl === "string" && data.imageUrl.length > 0;
}

/**
 * Hero avec 3 images locales si Firebase ne renvoie rien d'exploitable.
 * Les textes Firebase sont conservés quand ils existent.
 */
export function normalizeHeroSettings(
  data: Partial<HeroSettings> | null | undefined
): HeroSettings {
  if (!data || !hasFirebaseSlides(data)) {
    return withBrandText(data, {
      slides: getLocalHeroSlides(),
      description: data?.description ?? DEFAULT_HERO.description,
    });
  }

  let slides: HeroSlide[] = [];

  if (Array.isArray(data.slides) && data.slides.length > 0) {
    slides = data.slides.filter(
      (s) => s && typeof s.imageUrl === "string" && s.imageUrl
    );
  } else if (typeof data.imageUrl === "string" && data.imageUrl) {
    slides = [{ imageUrl: data.imageUrl, imagePath: data.imagePath }];
  }

  // Compléter jusqu'à 3 avec les images locales
  while (slides.length < 3) {
    const fallback = DEFAULT_HERO_SLIDES[slides.length];
    if (fallback) slides.push({ ...fallback });
    else break;
  }

  return withBrandText(data, {
    slides: slides.slice(0, 3),
    description: data?.description ?? DEFAULT_HERO.description,
  });
}

/** Repli complet : 3 images + textes par défaut */
export function getLocalHeroFallback(): HeroSettings {
  return { ...DEFAULT_HERO, slides: getLocalHeroSlides() };
}
