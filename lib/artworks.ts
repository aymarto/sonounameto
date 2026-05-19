import type { Artwork, ArtworkImage } from "@/lib/types";

export type DisplayImage = {
  url: string;
  alt: string;
};

/** Toutes les images d'une œuvre (principale + galerie), sans doublons. */
export function getArtworkImages(art: Artwork): DisplayImage[] {
  const seen = new Set<string>();
  const out: DisplayImage[] = [];

  const push = (url: string, alt: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ url, alt });
  };

  push(art.imageUrl, art.title);

  for (const img of art.galleryImages ?? []) {
    push(img.url, img.alt ?? art.title);
  }

  return out;
}

export function hasMultipleImages(art: Artwork): boolean {
  return getArtworkImages(art).length > 1;
}
