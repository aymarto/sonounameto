import { normalizeHeroTextFields } from "@/lib/site-settings";
import { resolveMediaUrl } from "@/lib/media-url";
import type { HeroSettings, HeroSlide } from "@/lib/types";

function extractSlides(
  data: Partial<HeroSettings> | null | undefined
): HeroSlide[] {
  if (!data) return [];

  if (Array.isArray(data.slides) && data.slides.length > 0) {
    return data.slides
      .filter((s) => s && typeof s.imageUrl === "string" && s.imageUrl.trim())
      .map((s) => ({
        imageUrl: resolveMediaUrl(s.imageUrl.trim()),
        ...(s.imagePath ? { imagePath: s.imagePath } : {}),
      }));
  }

  if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    return [
      {
        imageUrl: resolveMediaUrl(data.imageUrl.trim()),
        ...(data.imagePath ? { imagePath: data.imagePath } : {}),
      },
    ];
  }

  return [];
}

export function normalizeHeroSettings(
  data: Partial<HeroSettings> | null | undefined
): HeroSettings {
  return {
    ...normalizeHeroTextFields(data),
    slides: extractSlides(data),
  };
}

export function hasHeroContent(hero: HeroSettings): boolean {
  return Boolean(
    hero.slides.length > 0 ||
      hero.eyebrow ||
      hero.artistName ||
      hero.taglineLine1 ||
      hero.taglineLine2 ||
      hero.description
  );
}
