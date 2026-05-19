export type Artwork = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string; // ISO date
  image: string;
  medium?: string;
  dimensions?: string;
};

export type ArtEvent = {
  id: string;
  title: string;
  location: string;
  startDate: string; // ISO date
  endDate?: string;
  description: string;
  image?: string;
};

export const artworks: Artwork[] = [
  {
    id: "regard-suspendu",
    title: "Regard suspendu",
    shortDescription: "Portrait à l'huile, 2024.",
    description:
      "Un portrait intime explorant le silence du regard et la tension du moment présent.",
    date: "2024-03-12",
    image: "/images/portrait_0.jpeg",
    medium: "Huile sur toile",
    dimensions: "80 × 100 cm",
  },
  {
    id: "memoire-douce",
    title: "Mémoire douce",
    shortDescription: "Série Portraits I, 2024.",
    description:
      "Première pièce d'une série dédiée à la mémoire et aux visages oubliés.",
    date: "2024-05-04",
    image: "/images/portrait_1.jpeg",
    medium: "Acrylique et fusain",
    dimensions: "70 × 90 cm",
  },
  {
    id: "lumiere-interieure",
    title: "Lumière intérieure",
    shortDescription: "Série Portraits II, 2024.",
    description:
      "Étude de la lumière captée sur la peau, entre douceur et contraste.",
    date: "2024-06-21",
    image: "/images/portrait_2.jpeg",
    medium: "Huile sur toile",
    dimensions: "60 × 80 cm",
  },
  {
    id: "presence",
    title: "Présence",
    shortDescription: "Étude n°1, 2024.",
    description: "Une présence calme, presque suspendue dans le temps.",
    date: "2024-07-09",
    image: "/images/portrait_2_1.jpeg",
    medium: "Huile sur toile",
    dimensions: "50 × 70 cm",
  },
  {
    id: "echo",
    title: "Écho",
    shortDescription: "Étude n°2, 2024.",
    description: "Variation autour du même visage, dans une autre lumière.",
    date: "2024-08-02",
    image: "/images/portrait_2_2.jpeg",
    medium: "Huile sur toile",
    dimensions: "50 × 70 cm",
  },
  {
    id: "souffle",
    title: "Souffle",
    shortDescription: "Étude n°3, 2024.",
    description: "Travail sur la respiration et le mouvement intérieur.",
    date: "2024-09-15",
    image: "/images/portrait_2_3.jpeg",
    medium: "Huile sur toile",
    dimensions: "50 × 70 cm",
  },
  {
    id: "silence",
    title: "Silence",
    shortDescription: "Portrait, 2025.",
    description: "Portrait centré sur le calme et la retenue.",
    date: "2025-01-18",
    image: "/images/portrait_3.jpeg",
    medium: "Huile sur toile",
    dimensions: "70 × 90 cm",
  },
  {
    id: "traversee",
    title: "Traversée",
    shortDescription: "Portrait, 2025.",
    description: "Un visage entre deux mondes, deux instants.",
    date: "2025-02-22",
    image: "/images/portrait_3_1.jpeg",
    medium: "Acrylique sur toile",
    dimensions: "60 × 80 cm",
  },
  {
    id: "ailleurs",
    title: "Ailleurs",
    shortDescription: "Portrait, 2025.",
    description: "Un regard tourné vers un horizon invisible.",
    date: "2025-04-10",
    image: "/images/portrait_4.jpeg",
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
    image: "/images/portrait_2.jpeg",
  },
  {
    id: "residence-cotonou",
    title: "Résidence artistique",
    location: "Cotonou, Bénin",
    startDate: "2025-09-01",
    endDate: "2025-10-15",
    description:
      "Résidence de création autour du portrait contemporain africain.",
    image: "/images/portrait_3.jpeg",
  },
  {
    id: "salon-paris",
    title: "Salon international d'art",
    location: "Paris, France",
    startDate: "2026-02-18",
    endDate: "2026-02-22",
    description:
      "Participation au salon international avec une nouvelle série de portraits.",
    image: "/images/portrait_4.jpeg",
  },
];
