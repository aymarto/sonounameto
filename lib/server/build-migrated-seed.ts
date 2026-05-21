import {
  STATIC_ARTWORKS,
  STATIC_EVENTS,
  STATIC_HERO,
  STATIC_PROJECTS,
  STATIC_RAW_WORKS,
  STATIC_REFERENCES,
  STATIC_SITE,
} from "@/lib/migration/static-seed-data";
import type { MigratedSeedPayload } from "@/lib/migration/types";
import { migrateLocalImage } from "@/lib/server/migrate-static-images";
import type { UploadFolder } from "@/lib/server/upload-folders";
import type {
  ArtEvent,
  Artwork,
  ArtworkImage,
  Project,
  RawWorkImage,
  ReferenceItem,
} from "@/lib/types";

async function migrateImageUrl(
  url: string | undefined,
  folder: UploadFolder,
  cache: Map<string, { url: string; path: string }>,
  missing: Set<string>
): Promise<{ url: string; path?: string } | null> {
  if (!url) return null;
  const migrated = await migrateLocalImage(url, folder, cache);
  if (!migrated) {
    missing.add(url);
    return { url };
  }
  return { url: migrated.url, path: migrated.path };
}

async function migrateGalleryImages(
  images: ArtworkImage[] | undefined,
  folder: UploadFolder,
  cache: Map<string, { url: string; path: string }>,
  missing: Set<string>
): Promise<ArtworkImage[]> {
  if (!images?.length) return [];
  const rows: ArtworkImage[] = [];
  for (const img of images) {
    const migrated = await migrateImageUrl(img.url, folder, cache, missing);
    if (!migrated) continue;
    rows.push({
      url: migrated.url,
      ...(migrated.path ? { path: migrated.path } : {}),
      ...(img.alt ? { alt: img.alt } : {}),
    });
  }
  return rows;
}

export async function buildMigratedSeedPayload(): Promise<MigratedSeedPayload> {
  const cache = new Map<string, { url: string; path: string }>();
  const missing = new Set<string>();

  const artworks: Artwork[] = [];
  for (const [index, art] of STATIC_ARTWORKS.entries()) {
    const main = await migrateImageUrl(
      art.imageUrl,
      "artworks",
      cache,
      missing
    );
    if (!main) continue;
    artworks.push({
      ...art,
      imageUrl: main.url,
      ...(main.path ? { imagePath: main.path } : {}),
      galleryImages: await migrateGalleryImages(
        art.galleryImages,
        "artworks",
        cache,
        missing
      ),
      order: index,
    });
  }

  const events: ArtEvent[] = [];
  for (const [index, ev] of STATIC_EVENTS.entries()) {
    const image = ev.imageUrl
      ? await migrateImageUrl(ev.imageUrl, "events", cache, missing)
      : null;
    events.push({
      ...ev,
      ...(image
        ? { imageUrl: image.url, ...(image.path ? { imagePath: image.path } : {}) }
        : {}),
      order: index,
    });
  }

  const projects: Project[] = [];
  for (const [index, project] of STATIC_PROJECTS.entries()) {
    const cover = await migrateImageUrl(
      project.coverImageUrl,
      "projects",
      cache,
      missing
    );
    if (!cover) continue;
    projects.push({
      ...project,
      coverImageUrl: cover.url,
      ...(cover.path ? { coverImagePath: cover.path } : {}),
      order: index,
    });
  }

  const references: ReferenceItem[] = [];
  for (const [index, ref] of STATIC_REFERENCES.entries()) {
    const image = await migrateImageUrl(
      ref.imageUrl,
      "references",
      cache,
      missing
    );
    if (!image) continue;
    references.push({
      ...ref,
      imageUrl: image.url,
      ...(image.path ? { imagePath: image.path } : {}),
      order: index,
    });
  }

  const rawWorks: RawWorkImage[] = [];
  for (const [index, raw] of STATIC_RAW_WORKS.entries()) {
    const image = await migrateImageUrl(
      raw.imageUrl,
      "raw-work",
      cache,
      missing
    );
    if (!image) continue;
    rawWorks.push({
      ...raw,
      imageUrl: image.url,
      ...(image.path ? { imagePath: image.path } : {}),
      order: index,
    });
  }

  const heroSlides = [];
  for (const slide of STATIC_HERO.slides) {
    const migrated = await migrateImageUrl(
      slide.imageUrl,
      "hero",
      cache,
      missing
    );
    if (!migrated) continue;
    heroSlides.push({
      imageUrl: migrated.url,
      ...(migrated.path ? { imagePath: migrated.path } : {}),
    });
  }

  const aboutImage = await migrateImageUrl(
    STATIC_SITE.aboutImageUrl,
    "about",
    cache,
    missing
  );

  return {
    artworks,
    events,
    projects,
    references,
    rawWorks,
    hero: {
      ...STATIC_HERO,
      slides:
        heroSlides.length > 0
          ? heroSlides
          : STATIC_HERO.slides.map((s) => ({ ...s })),
    },
    site: {
      ...STATIC_SITE,
      ...(aboutImage
        ? {
            aboutImageUrl: aboutImage.url,
            ...(aboutImage.path ? { aboutImagePath: aboutImage.path } : {}),
          }
        : {}),
    },
    stats: {
      imagesCopied: cache.size,
      missingImages: [...missing],
    },
  };
}
