import {
  ARTIST_NAME,
  HERO_DESCRIPTION,
  HERO_EYEBROW,
  HERO_TAGLINE_LINE1,
  HERO_TAGLINE_LINE2,
} from "@/lib/brand";

export type ArtworkImage = {
  url: string;
  path?: string;
  alt?: string;
};

export type Artwork = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  imageUrl: string;
  imagePath?: string;
  galleryImages?: ArtworkImage[];
  medium?: string;
  dimensions?: string;
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type EventCategory = "exposition" | "evenement";

export type ArtEvent = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  category?: EventCategory;
  imageUrl?: string;
  imagePath?: string;
  published?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  title: string;
  coverImageUrl: string;
  coverImagePath?: string;
  artworkIds: string[];
  description?: string;
  published?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ReferenceItem = {
  id: string;
  imageUrl: string;
  imagePath?: string;
  title: string;
  description?: string;
  published?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type RawWorkImage = {
  id: string;
  imageUrl: string;
  imagePath?: string;
  alt?: string;
  published?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroSlide = {
  imageUrl: string;
  imagePath?: string;
};

export type HeroSettings = {
  slides: HeroSlide[];
  eyebrow: string;
  artistName: string;
  taglineLine1: string;
  taglineLine2: string;
  description: string;
  /** @deprecated Anciens champs — migrés automatiquement */
  title?: string;
  subtitle?: string;
  /** @deprecated Ancien format — migré vers slides */
  imageUrl?: string;
  imagePath?: string;
};

export type SiteSettings = {
  galleryName: string;
  footerText: string;
  contactEmail: string;
  contactInstagram: string;
  contactFacebook: string;
  contactLocation: string;
  portfolioUrl: string;
  portfolioPath?: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  aboutImagePath?: string;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { imageUrl: "/images/portrait_0.jpeg" },
  { imageUrl: "/images/portrait_1.jpeg" },
  { imageUrl: "/images/portrait_2.jpeg" },
];

export const DEFAULT_HERO: HeroSettings = {
  slides: DEFAULT_HERO_SLIDES,
  eyebrow: HERO_EYEBROW,
  artistName: ARTIST_NAME,
  taglineLine1: HERO_TAGLINE_LINE1,
  taglineLine2: HERO_TAGLINE_LINE2,
  description: HERO_DESCRIPTION,
};
