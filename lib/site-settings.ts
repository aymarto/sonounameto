import type { HeroSettings, SiteSettings } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media-url";

/** Valeurs vides — aucun contenu CMS par défaut côté public. */
export const EMPTY_SITE_SETTINGS: SiteSettings = {
  galleryName: "",
  footerText: "",
  contactEmail: "",
  contactInstagram: "",
  contactFacebook: "",
  contactLocation: "",
  portfolioUrl: "",
  aboutEyebrow: "",
  aboutTitle: "",
  aboutDescription: "",
  aboutImageUrl: "",
};

/** @deprecated Utiliser EMPTY_SITE_SETTINGS */
export const DEFAULT_SITE_SETTINGS = EMPTY_SITE_SETTINGS;

export function normalizeSiteSettings(
  data: Partial<SiteSettings> | null | undefined
): SiteSettings {
  if (!data) return { ...EMPTY_SITE_SETTINGS };

  return {
    galleryName: data.galleryName?.trim() ?? "",
    footerText: data.footerText?.trim() ?? "",
    contactEmail: data.contactEmail?.trim() ?? "",
    contactInstagram: data.contactInstagram?.trim() ?? "",
    contactFacebook: data.contactFacebook?.trim() ?? "",
    contactLocation: data.contactLocation?.trim() ?? "",
    portfolioUrl: data.portfolioUrl?.trim() ?? "",
    ...(data.portfolioPath ? { portfolioPath: data.portfolioPath } : {}),
    aboutEyebrow: data.aboutEyebrow?.trim() ?? "",
    aboutTitle: data.aboutTitle?.trim() ?? "",
    aboutDescription: data.aboutDescription?.trim() ?? "",
    aboutImageUrl: resolveMediaUrl(data.aboutImageUrl?.trim() ?? ""),
    ...(data.aboutImagePath ? { aboutImagePath: data.aboutImagePath } : {}),
  };
}

export function hasAboutContent(settings: SiteSettings): boolean {
  return Boolean(
    settings.aboutEyebrow ||
      settings.aboutTitle ||
      settings.aboutDescription ||
      settings.aboutImageUrl
  );
}

export function normalizeHeroTextFields(
  data: Partial<HeroSettings> | null | undefined
): Pick<
  HeroSettings,
  "eyebrow" | "artistName" | "taglineLine1" | "taglineLine2" | "description"
> {
  return {
    eyebrow: data?.eyebrow?.trim() || data?.title?.trim() || "",
    artistName: data?.artistName?.trim() || data?.subtitle?.trim() || "",
    taglineLine1: data?.taglineLine1?.trim() ?? "",
    taglineLine2: data?.taglineLine2?.trim() ?? "",
    description: data?.description?.trim() ?? "",
  };
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
