export type Artwork = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  imageUrl: string;
  imagePath?: string; // Firebase Storage path, for deletion
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
  startDate: string; // ISO date
  endDate?: string;
  description: string;
  imageUrl?: string;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroSettings = {
  imageUrl: string;
  imagePath?: string;
  title: string;
  subtitle: string;
  description: string;
};

export const DEFAULT_HERO: HeroSettings = {
  imageUrl: "/images/portrait_0.jpeg",
  title: "SONOUNAMETO",
  subtitle: "Portraits & expositions",
  description:
    "Une exploration des visages, du silence et de la lumière. Découvrez les œuvres et les évènements à venir.",
};
