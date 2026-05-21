import {
  ARTIST_NAME,
  GALLERY_NAME,
  HERO_DESCRIPTION,
  HERO_EYEBROW,
  HERO_TAGLINE_LINE1,
  HERO_TAGLINE_LINE2,
} from "@/lib/brand";
import { SOCIAL_LINKS } from "@/lib/social";
import type {
  ArtEvent,
  Artwork,
  HeroSettings,
  Project,
  RawWorkImage,
  ReferenceItem,
  SiteSettings,
} from "@/lib/types";

/** Données de démo d'origine — utilisées uniquement pour la migration uploads + Firestore. */
export const STATIC_ARTWORKS: Artwork[] = [
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
    published: true,
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
    published: true,
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
    published: true,
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
    published: true,
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
    published: true,
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
    published: true,
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
    published: true,
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
    published: true,
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
    published: true,
  },
];

export const STATIC_EVENTS: ArtEvent[] = [
  {
    id: "expo-lome-2025",
    title: "Exposition « Visages »",
    location: "Galerie Lomé, Togo",
    startDate: "2025-06-12",
    endDate: "2025-07-04",
    description:
      "Première exposition personnelle réunissant une sélection de portraits récents.",
    category: "exposition",
    imageUrl: "/images/portrait_2.jpeg",
    published: true,
  },
  {
    id: "residence-cotonou",
    title: "Résidence artistique",
    location: "Cotonou, Bénin",
    startDate: "2025-09-01",
    endDate: "2025-10-15",
    description:
      "Résidence de création autour du portrait contemporain africain.",
    category: "evenement",
    imageUrl: "/images/portrait_3.jpeg",
    published: true,
  },
  {
    id: "salon-paris",
    title: "Salon international d'art",
    location: "Paris, France",
    startDate: "2026-02-18",
    endDate: "2026-02-22",
    description:
      "Participation au salon international avec une nouvelle série de portraits.",
    category: "evenement",
    imageUrl: "/images/portrait_4.jpeg",
    published: true,
  },
];

export const STATIC_PROJECTS: Project[] = [
  {
    id: "emotion",
    title: "Émotion",
    coverImageUrl: "/images/portrait_2.jpeg",
    artworkIds: ["lumiere-interieure", "presence", "echo", "souffle"],
    published: true,
  },
  {
    id: "portraits-2024",
    title: "Portraits 2024",
    coverImageUrl: "/images/portrait_0.jpeg",
    artworkIds: ["regard-suspendu", "memoire-douce"],
    published: true,
  },
  {
    id: "portraits-2025",
    title: "Portraits 2025",
    coverImageUrl: "/images/portrait_3.jpeg",
    artworkIds: ["silence", "traversee", "ailleurs"],
    published: true,
  },
  {
    id: "lumiere",
    title: "Lumière",
    coverImageUrl: "/images/portrait_2_1.jpeg",
    artworkIds: ["lumiere-interieure", "presence", "echo"],
    published: true,
  },
  {
    id: "memoires",
    title: "Mémoires",
    coverImageUrl: "/images/portrait_1.jpeg",
    artworkIds: ["memoire-douce", "regard-suspendu", "souffle"],
    published: true,
  },
  {
    id: "visages-matiere",
    title: "Visages & matière",
    coverImageUrl: "/images/portrait_4.jpeg",
    artworkIds: ["ailleurs", "traversee", "silence"],
    published: true,
  },
  {
    id: "etudes",
    title: "Études",
    coverImageUrl: "/images/portrait_2_2.jpeg",
    artworkIds: ["echo", "souffle", "presence"],
    published: true,
  },
  {
    id: "regards",
    title: "Regards",
    coverImageUrl: "/images/portrait_3_1.jpeg",
    artworkIds: ["regard-suspendu", "traversee", "lumiere-interieure"],
    published: true,
  },
];

export const STATIC_RAW_WORKS: RawWorkImage[] = [
  { id: "raw-1", imageUrl: "/images/portrait_2_1.jpeg", published: true },
  { id: "raw-2", imageUrl: "/images/portrait_2_2.jpeg", published: true },
  { id: "raw-3", imageUrl: "/images/portrait_2_3.jpeg", published: true },
  { id: "raw-4", imageUrl: "/images/portrait_3_1.jpeg", published: true },
  { id: "raw-5", imageUrl: "/images/portrait_4.jpeg", published: true },
  { id: "raw-6", imageUrl: "/images/portrait_1.jpeg", published: true },
];

export const STATIC_REFERENCES: ReferenceItem[] = [
  {
    id: "ref-1",
    imageUrl: "/images/portrait_0.jpeg",
    title: "Galerie Lomé",
    description: "Exposition collective — portraits contemporains, 2024.",
    published: true,
  },
  {
    id: "ref-2",
    imageUrl: "/images/portrait_3.jpeg",
    title: "Résidence Cotonou",
    description: "Programme de création et recherche sur le portrait.",
    published: true,
  },
  {
    id: "ref-3",
    imageUrl: "/images/portrait_4.jpeg",
    title: "Salon international",
    description: "Présentation d'une série inédite, Paris.",
    published: true,
  },
];

export const STATIC_HERO: HeroSettings = {
  slides: [
    { imageUrl: "/images/portrait_0.jpeg" },
    { imageUrl: "/images/portrait_1.jpeg" },
    { imageUrl: "/images/portrait_2.jpeg" },
  ],
  eyebrow: HERO_EYEBROW,
  artistName: ARTIST_NAME,
  taglineLine1: HERO_TAGLINE_LINE1,
  taglineLine2: HERO_TAGLINE_LINE2,
  description: HERO_DESCRIPTION,
};

export const STATIC_SITE: SiteSettings = {
  galleryName: GALLERY_NAME,
  footerText: `Galerie de l'artiste ${ARTIST_NAME}. Portraits, expositions et collaborations.`,
  contactEmail: SOCIAL_LINKS.email,
  contactInstagram: SOCIAL_LINKS.instagram,
  contactFacebook: SOCIAL_LINKS.facebook,
  contactLocation: "Lomé — sur rendez-vous",
  portfolioUrl: SOCIAL_LINKS.portfolio,
  aboutEyebrow: "À propos",
  aboutTitle: "L'art comme un regard tendu vers l'autre.",
  aboutDescription: `${ARTIST_NAME} est un artiste peintre dont le travail s'articule autour du portrait, de la mémoire et de la lumière. Chaque toile cherche à saisir un instant suspendu, un regard, une présence.\n\nMêlant huile, acrylique et fusain, l'artiste construit une série continue de visages où le silence devient matière.`,
  aboutImageUrl: "/images/portrait_3_1.jpeg",
};
