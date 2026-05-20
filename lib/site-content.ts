export type Project = {
  id: string;
  title: string;
  coverImageUrl: string;
  artworkIds: string[];
};

export type ReferenceItem = {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
};

export type RawWorkImage = {
  id: string;
  imageUrl: string;
};

export const projects: Project[] = [
  {
    id: "emotion",
    title: "Émotion",
    coverImageUrl: "/images/portrait_2.jpeg",
    artworkIds: [
      "lumiere-interieure",
      "presence",
      "echo",
      "souffle",
    ],
  },
  {
    id: "portraits-2024",
    title: "Portraits 2024",
    coverImageUrl: "/images/portrait_0.jpeg",
    artworkIds: ["regard-suspendu", "memoire-douce"],
  },
  {
    id: "portraits-2025",
    title: "Portraits 2025",
    coverImageUrl: "/images/portrait_3.jpeg",
    artworkIds: ["silence", "traversee", "ailleurs"],
  },
  {
    id: "lumiere",
    title: "Lumière",
    coverImageUrl: "/images/portrait_2_1.jpeg",
    artworkIds: ["lumiere-interieure", "presence", "echo"],
  },
  {
    id: "memoires",
    title: "Mémoires",
    coverImageUrl: "/images/portrait_1.jpeg",
    artworkIds: ["memoire-douce", "regard-suspendu", "souffle"],
  },
  {
    id: "visages-matiere",
    title: "Visages & matière",
    coverImageUrl: "/images/portrait_4.jpeg",
    artworkIds: ["ailleurs", "traversee", "silence"],
  },
  {
    id: "etudes",
    title: "Études",
    coverImageUrl: "/images/portrait_2_2.jpeg",
    artworkIds: ["echo", "souffle", "presence"],
  },
  {
    id: "regards",
    title: "Regards",
    coverImageUrl: "/images/portrait_3_1.jpeg",
    artworkIds: ["regard-suspendu", "traversee", "lumiere-interieure"],
  },
];

export const rawWorkImages: RawWorkImage[] = [
  { id: "raw-1", imageUrl: "/images/portrait_2_1.jpeg" },
  { id: "raw-2", imageUrl: "/images/portrait_2_2.jpeg" },
  { id: "raw-3", imageUrl: "/images/portrait_2_3.jpeg" },
  { id: "raw-4", imageUrl: "/images/portrait_3_1.jpeg" },
  { id: "raw-5", imageUrl: "/images/portrait_4.jpeg" },
  { id: "raw-6", imageUrl: "/images/portrait_1.jpeg" },
];

export const references: ReferenceItem[] = [
  {
    id: "ref-1",
    imageUrl: "/images/portrait_0.jpeg",
    title: "Galerie Lomé",
    description: "Exposition collective — portraits contemporains, 2024.",
  },
  {
    id: "ref-2",
    imageUrl: "/images/portrait_3.jpeg",
    title: "Résidence Cotonou",
    description: "Programme de création et recherche sur le portrait.",
  },
  {
    id: "ref-3",
    imageUrl: "/images/portrait_4.jpeg",
    title: "Salon international",
    description: "Présentation d'une série inédite, Paris.",
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
