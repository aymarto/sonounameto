import type { Artwork, ArtEvent } from "@/lib/types";

export const artworks: Artwork[] = [
  {
    id: "regard-suspendu",
    title: "Regard suspendu",
    shortDescription: "Portrait à l'huile, 2024.",
    description:
      "Un portrait intime explorant le silence du regard et la tension du moment présent. Le travail sur les contrastes et la lumière latérale donne au visage une présence presque sculpturale.",
    date: "2024-03-12",
    imageUrl: "/images/portrait_0.jpeg",
    galleryImages: [
      { url: "/images/portrait_1.jpeg", alt: "Regard suspendu — détail" },
    ],
    medium: "Huile sur toile",
    dimensions: "80 × 100 cm",
  },
  {
    id: "memoire-douce",
    title: "Mémoire douce",
    shortDescription: "Série Portraits I, 2024.",
    description:
      "Première pièce d'une série dédiée à la mémoire et aux visages oubliés. Une palette douce, des traits effacés, comme un souvenir qui revient par fragments.",
    date: "2024-05-04",
    imageUrl: "/images/portrait_1.jpeg",
    galleryImages: [
      { url: "/images/portrait_0.jpeg", alt: "Mémoire douce — vue d'ensemble" },
      { url: "/images/portrait_2.jpeg", alt: "Mémoire douce — variation" },
    ],
    medium: "Acrylique et fusain",
    dimensions: "70 × 90 cm",
  },
  {
    id: "lumiere-interieure",
    title: "Lumière intérieure",
    shortDescription: "Série Portraits II, 2024.",
    description:
      "Étude de la lumière captée sur la peau, entre douceur et contraste. Le visage émerge d'un fond sombre, porté par une clarté intérieure.",
    date: "2024-06-21",
    imageUrl: "/images/portrait_2.jpeg",
    galleryImages: [
      { url: "/images/portrait_2_1.jpeg", alt: "Lumière intérieure — étude 1" },
      { url: "/images/portrait_2_2.jpeg", alt: "Lumière intérieure — étude 2" },
      { url: "/images/portrait_2_3.jpeg", alt: "Lumière intérieure — étude 3" },
    ],
    medium: "Huile sur toile",
    dimensions: "60 × 80 cm",
  },
  {
    id: "presence",
    title: "Présence",
    shortDescription: "Étude n°1, 2024.",
    description: "Une présence calme, presque suspendue dans le temps.",
    date: "2024-07-09",
    imageUrl: "/images/portrait_2_1.jpeg",
    galleryImages: [
      { url: "/images/portrait_2.jpeg", alt: "Présence — contexte série" },
      { url: "/images/portrait_2_2.jpeg", alt: "Présence — autre lumière" },
    ],
    medium: "Huile sur toile",
    dimensions: "50 × 70 cm",
  },
  {
    id: "echo",
    title: "Écho",
    shortDescription: "Étude n°2, 2024.",
    description: "Variation autour du même visage, dans une autre lumière.",
    date: "2024-08-02",
    imageUrl: "/images/portrait_2_2.jpeg",
    galleryImages: [
      { url: "/images/portrait_2_1.jpeg", alt: "Écho — étude précédente" },
      { url: "/images/portrait_2_3.jpeg", alt: "Écho — étude suivante" },
    ],
    medium: "Huile sur toile",
    dimensions: "50 × 70 cm",
  },
  {
    id: "souffle",
    title: "Souffle",
    shortDescription: "Étude n°3, 2024.",
    description: "Travail sur la respiration et le mouvement intérieur.",
    date: "2024-09-15",
    imageUrl: "/images/portrait_2_3.jpeg",
    galleryImages: [
      { url: "/images/portrait_2.jpeg", alt: "Souffle — série complète" },
      { url: "/images/portrait_2_1.jpeg", alt: "Souffle — détail" },
    ],
    medium: "Huile sur toile",
    dimensions: "50 × 70 cm",
  },
  {
    id: "silence",
    title: "Silence",
    shortDescription: "Portrait, 2025.",
    description:
      "Portrait centré sur le calme et la retenue. Peu de gestes, beaucoup d'air autour du visage.",
    date: "2025-01-18",
    imageUrl: "/images/portrait_3.jpeg",
    galleryImages: [
      { url: "/images/portrait_3_1.jpeg", alt: "Silence — variation" },
    ],
    medium: "Huile sur toile",
    dimensions: "70 × 90 cm",
  },
  {
    id: "traversee",
    title: "Traversée",
    shortDescription: "Portrait, 2025.",
    description: "Un visage entre deux mondes, deux instants.",
    date: "2025-02-22",
    imageUrl: "/images/portrait_3_1.jpeg",
    galleryImages: [
      { url: "/images/portrait_3.jpeg", alt: "Traversée — portrait lié" },
      { url: "/images/portrait_4.jpeg", alt: "Traversée — horizon" },
    ],
    medium: "Acrylique sur toile",
    dimensions: "60 × 80 cm",
  },
  {
    id: "ailleurs",
    title: "Ailleurs",
    shortDescription: "Portrait, 2025.",
    description:
      "Un regard tourné vers un horizon invisible. La couleur reste contenue pour laisser toute la place au regard.",
    date: "2025-04-10",
    imageUrl: "/images/portrait_4.jpeg",
    galleryImages: [
      { url: "/images/portrait_3.jpeg", alt: "Ailleurs — série 2025" },
      { url: "/images/portrait_3_1.jpeg", alt: "Ailleurs — étude" },
    ],
    medium: "Huile sur toile",
    dimensions: "80 × 100 cm",
  },
];

export const events: ArtEvent[] = [
  {
    id: "expo-lome-2025",
    title: "Exposition « Visages »",
    location: "Galerie Lomé, Togo",
    startDate: "2025-06-12",
    endDate: "2025-07-04",
    description:
      "Première exposition personnelle réunissant une sélection de portraits récents.",
    imageUrl: "/images/portrait_2.jpeg",
  },
  {
    id: "residence-cotonou",
    title: "Résidence artistique",
    location: "Cotonou, Bénin",
    startDate: "2025-09-01",
    endDate: "2025-10-15",
    description:
      "Résidence de création autour du portrait contemporain africain.",
    imageUrl: "/images/portrait_3.jpeg",
  },
  {
    id: "salon-paris",
    title: "Salon international d'art",
    location: "Paris, France",
    startDate: "2026-02-18",
    endDate: "2026-02-22",
    description:
      "Participation au salon international avec une nouvelle série de portraits.",
    imageUrl: "/images/portrait_4.jpeg",
  },
];

export function getStaticArtwork(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}
