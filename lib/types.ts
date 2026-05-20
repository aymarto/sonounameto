import { ARTIST_NAME, GALLERY_NAME } from "@/lib/brand";

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
  createdAt?: string;
  updatedAt?: string;
};

export type ArtEvent = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  imageUrl?: string;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroSlide = {
  imageUrl: string;
  imagePath?: string;
};

export type HeroSettings = {
  slides: HeroSlide[];
  title: string;
  subtitle: string;
  description: string;
  /** @deprecated Ancien format — migré vers slides */
  imageUrl?: string;
  imagePath?: string;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { imageUrl: "/images/portrait_0.jpeg" },
  { imageUrl: "/images/portrait_1.jpeg" },
  { imageUrl: "/images/portrait_2.jpeg" },
];

export const DEFAULT_HERO: HeroSettings = {
  slides: DEFAULT_HERO_SLIDES,
  title: GALLERY_NAME,
  subtitle: ARTIST_NAME,
  description:
    "Une exploration des visages, du silence et de la lumière. Découvrez les œuvres et les évènements à venir.",
};
