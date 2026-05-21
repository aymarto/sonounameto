import {
  ARTIST_NAME,
  GALLERY_NAME,
  HERO_DESCRIPTION,
  HERO_EYEBROW,
  HERO_TAGLINE_LINE1,
  HERO_TAGLINE_LINE2,
} from "@/lib/brand";
import { SOCIAL_LINKS } from "@/lib/social";
import type { HeroSettings, SiteSettings } from "@/lib/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  galleryName: GALLERY_NAME,
  footerText: `Galerie de l'artiste ${ARTIST_NAME}. Portraits, expositions et collaborations.`,
  contactEmail: SOCIAL_LINKS.email,
  contactInstagram: SOCIAL_LINKS.instagram,
  contactFacebook: SOCIAL_LINKS.facebook,
  contactLocation: "Lomé — sur rendez-vous",
  portfolioUrl: SOCIAL_LINKS.portfolio,
  aboutEyebrow: "À propos",
  aboutTitle: "L'art comme un regard tendu vers l'autre.",
  aboutDescription: `${ARTIST_NAME} est un artiste peintre dont le travail s'articule autour du portrait, de la mémoire et de la lumière. Chaque toile cherche à saisir un instant suspendu, un regard, une présence.\n\nMêlant huile, acrylique et fusain, l'artiste construit une série continue de visages où le silence devient matière.`,
  aboutImageUrl: "/images/portrait_3_1.jpeg",
};

export function normalizeSiteSettings(
  data: Partial<SiteSettings> | null | undefined
): SiteSettings {
  const base = DEFAULT_SITE_SETTINGS;
  if (!data) return { ...base };

  return {
    galleryName: data.galleryName?.trim() || base.galleryName,
    footerText: data.footerText?.trim() || base.footerText,
    contactEmail: data.contactEmail?.trim() || base.contactEmail,
    contactInstagram: data.contactInstagram?.trim() || base.contactInstagram,
    contactFacebook: data.contactFacebook?.trim() || base.contactFacebook,
    contactLocation: data.contactLocation?.trim() || base.contactLocation,
    portfolioUrl: data.portfolioUrl?.trim() || base.portfolioUrl,
    ...(data.portfolioPath ? { portfolioPath: data.portfolioPath } : {}),
    aboutEyebrow: data.aboutEyebrow?.trim() || base.aboutEyebrow,
    aboutTitle: data.aboutTitle?.trim() || base.aboutTitle,
    aboutDescription: data.aboutDescription?.trim() || base.aboutDescription,
    aboutImageUrl: data.aboutImageUrl?.trim() || base.aboutImageUrl,
    ...(data.aboutImagePath ? { aboutImagePath: data.aboutImagePath } : {}),
  };
}

export function normalizeHeroTextFields(
  data: Partial<HeroSettings> | null | undefined
): Pick<
  HeroSettings,
  "eyebrow" | "artistName" | "taglineLine1" | "taglineLine2" | "description"
> {
  return {
    eyebrow: data?.eyebrow?.trim() || data?.title?.trim() || HERO_EYEBROW,
    artistName: data?.artistName?.trim() || data?.subtitle?.trim() || ARTIST_NAME,
    taglineLine1:
      data?.taglineLine1?.trim() || HERO_TAGLINE_LINE1,
    taglineLine2:
      data?.taglineLine2?.trim() || HERO_TAGLINE_LINE2,
    description: data?.description?.trim() || HERO_DESCRIPTION,
  };
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
