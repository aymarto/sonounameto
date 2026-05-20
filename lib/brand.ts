/** Nom de la galerie (marque du site) — espace insécable pour éviter « NOUNAMETO » seul à la ligne */
export const GALLERY_NAME = "Galerie\u00a0NOUNAMETO";

/** Nom complet de l'artiste */
export const ARTIST_NAME = "Steve SONOUNAMETO";

/** Suffixe des titres de page (ex. « Œuvres — Galerie NOUNAMETO ») */
export function pageTitle(section: string): string {
  return `${section} — ${GALLERY_NAME}`;
}
