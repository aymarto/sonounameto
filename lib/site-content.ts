import type { Project, RawWorkImage, ReferenceItem } from "@/lib/types";

export type { Project, RawWorkImage, ReferenceItem };

export const projects: Project[] = [
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

export const rawWorkImages: RawWorkImage[] = [
  { id: "raw-1", imageUrl: "/images/portrait_2_1.jpeg", published: true },
  { id: "raw-2", imageUrl: "/images/portrait_2_2.jpeg", published: true },
  { id: "raw-3", imageUrl: "/images/portrait_2_3.jpeg", published: true },
  { id: "raw-4", imageUrl: "/images/portrait_3_1.jpeg", published: true },
  { id: "raw-5", imageUrl: "/images/portrait_4.jpeg", published: true },
  { id: "raw-6", imageUrl: "/images/portrait_1.jpeg", published: true },
];

export const references: ReferenceItem[] = [
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

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
