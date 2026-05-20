/** Nom de la galerie (marque du site) — espace insécable pour éviter « NOUNAMETO » seul à la ligne */
export const GALLERY_NAME = "Galerie\u00a0NOUNAMETO";

/** Nom complet de l'artiste */
export const ARTIST_NAME = "Steve SONOUNAMETO";

/** Textes hero — accueil (fixes, sans nom de galerie) */
export const HERO_EYEBROW = "Galerie de l'artiste";
export const HERO_TAGLINE_LINE1 = "Portraits &";
export const HERO_TAGLINE_LINE2 = "expositions";
export const HERO_DESCRIPTION =
  "Une exploration des visages, du silence et de la lumière. Découvrez les œuvres et les évènements à venir.";

/** Suffixe des titres de page (ex. « Œuvres — Galerie NOUNAMETO ») */
export function pageTitle(section: string): string {
  return `${section} — ${GALLERY_NAME}`;
}
