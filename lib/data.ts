import type { Artwork, ArtEvent } from "@/lib/types";

/** Données CMS — uniquement Firestore en production. */
export const artworks: Artwork[] = [];
export const events: ArtEvent[] = [];

export function getStaticArtwork(_id: string): Artwork | undefined {
  return undefined;
}
