import type {
  ArtEvent,
  Artwork,
  HeroSettings,
  Project,
  RawWorkImage,
  ReferenceItem,
  SiteSettings,
} from "@/lib/types";

export type MigratedSeedPayload = {
  artworks: Artwork[];
  events: ArtEvent[];
  projects: Project[];
  references: ReferenceItem[];
  rawWorks: RawWorkImage[];
  hero: HeroSettings;
  site: SiteSettings;
  stats: {
    imagesCopied: number;
    missingImages: string[];
  };
};

export type MigrationResult = {
  artworks: number;
  events: number;
  projects: number;
  references: number;
  rawWorks: number;
  settings: number;
  imagesCopied: number;
  missingImages: string[];
};
