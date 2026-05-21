import type { Project, RawWorkImage, ReferenceItem } from "@/lib/types";

export type { Project, RawWorkImage, ReferenceItem };

/** Données CMS — uniquement Firestore en production. */
export const projects: Project[] = [];
export const rawWorkImages: RawWorkImage[] = [];
export const references: ReferenceItem[] = [];

export function getProject(_id: string): Project | undefined {
  return undefined;
}
