"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebase, isFirebaseConfigured } from "@/lib/firebase";
import { firestoreWriteData } from "@/lib/firestore-write";
import { resolveMediaUrl } from "@/lib/media-url";
import { isPublished } from "@/lib/publish";
import type {
  ArtEvent,
  Artwork,
  Project,
  RawWorkImage,
  ReferenceItem,
} from "@/lib/types";

function db() {
  const fb = getFirebase();
  if (!fb) throw new Error("Firebase n'est pas configuré.");
  return fb.db;
}

function toISO(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return undefined;
}

function mapProject(id: string, data: DocumentData): Project {
  return {
    id,
    title: data.title ?? "",
    coverImageUrl: resolveMediaUrl(data.coverImageUrl ?? ""),
    coverImagePath: data.coverImagePath,
    artworkIds: Array.isArray(data.artworkIds)
      ? data.artworkIds.filter((x) => typeof x === "string")
      : [],
    description: data.description,
    published: data.published !== false,
    order: data.order,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

function mapReference(id: string, data: DocumentData): ReferenceItem {
  return {
    id,
    title: data.title ?? "",
    description: data.description,
    imageUrl: resolveMediaUrl(data.imageUrl ?? ""),
    imagePath: data.imagePath,
    published: data.published !== false,
    order: data.order,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

function mapRawWork(id: string, data: DocumentData): RawWorkImage {
  return {
    id,
    imageUrl: resolveMediaUrl(data.imageUrl ?? ""),
    imagePath: data.imagePath,
    alt: data.alt,
    published: data.published !== false,
    order: data.order,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

function sortByOrder<T extends { order?: number; title?: string; id: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const ao = a.order ?? 9999;
    const bo = b.order ?? 9999;
    if (ao !== bo) return ao - bo;
    return (a.title ?? a.id).localeCompare(b.title ?? b.id, "fr");
  });
}

function projectsQuery() {
  return query(collection(db(), "projects"), orderBy("order", "asc"));
}

function referencesQuery() {
  return query(collection(db(), "references"), orderBy("order", "asc"));
}

function rawWorksQuery() {
  return query(collection(db(), "rawWorks"), orderBy("order", "asc"));
}

async function fetchProjects(): Promise<Project[]> {
  const snap = await getDocs(projectsQuery());
  return sortByOrder(snap.docs.map((d) => mapProject(d.id, d.data())));
}

async function fetchReferences(): Promise<ReferenceItem[]> {
  const snap = await getDocs(referencesQuery());
  return sortByOrder(snap.docs.map((d) => mapReference(d.id, d.data())));
}

async function fetchRawWorks(): Promise<RawWorkImage[]> {
  const snap = await getDocs(rawWorksQuery());
  return sortByOrder(snap.docs.map((d) => mapRawWork(d.id, d.data())));
}

function publishedRows<T extends { published?: boolean }>(rows: T[]): T[] {
  return rows.filter(isPublished);
}

// ---------- Projects ----------

export async function listProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return await fetchProjects();
  } catch {
    return [];
  }
}

export async function listPublishedProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return publishedRows(await fetchProjects());
  } catch (err) {
    console.error("[Firestore] listPublishedProjects:", err);
    return [];
  }
}

export function subscribeProjects(cb: (rows: Project[]) => void): Unsubscribe {
  if (!isFirebaseConfigured()) {
    cb([]);
    return () => {};
  }
  return onSnapshot(
    projectsQuery(),
    (snap) => {
      cb(sortByOrder(snap.docs.map((d) => mapProject(d.id, d.data()))));
    },
    (err) => {
      console.error(err);
      cb([]);
    }
  );
}

export async function getProject(id: string): Promise<Project | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const snap = await getDoc(doc(db(), "projects", id));
    if (!snap.exists()) return null;
    return mapProject(snap.id, snap.data());
  } catch {
    return null;
  }
}

export async function getPublishedProject(id: string): Promise<Project | null> {
  try {
    const row = await getProject(id);
    if (row && isPublished(row)) return row;
  } catch {
    // Firestore indisponible
  }
  return null;
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db(), "projects"), {
    ...firestoreWriteData({
      ...data,
      published: data.published !== false,
    }),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db(), "projects", id), {
    ...firestoreWriteData(data as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db(), "projects", id));
}

// ---------- References ----------

export async function listReferences(): Promise<ReferenceItem[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return await fetchReferences();
  } catch {
    return [];
  }
}

export async function listPublishedReferences(): Promise<ReferenceItem[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return publishedRows(await fetchReferences());
  } catch {
    return [];
  }
}

export function subscribeReferences(
  cb: (rows: ReferenceItem[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    cb([]);
    return () => {};
  }
  return onSnapshot(
    referencesQuery(),
    (snap) => {
      cb(sortByOrder(snap.docs.map((d) => mapReference(d.id, d.data()))));
    },
    (err) => {
      console.error(err);
      cb([]);
    }
  );
}

export async function getReference(id: string): Promise<ReferenceItem | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const snap = await getDoc(doc(db(), "references", id));
    if (!snap.exists()) return null;
    return mapReference(snap.id, snap.data());
  } catch {
    return null;
  }
}

export async function createReference(
  data: Omit<ReferenceItem, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db(), "references"), {
    ...firestoreWriteData({
      ...data,
      published: data.published !== false,
    }),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateReference(
  id: string,
  data: Partial<Omit<ReferenceItem, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db(), "references", id), {
    ...firestoreWriteData(data as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteReference(id: string): Promise<void> {
  await deleteDoc(doc(db(), "references", id));
}

// ---------- Raw work ----------

export async function listRawWorks(): Promise<RawWorkImage[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return await fetchRawWorks();
  } catch {
    return [];
  }
}

export async function listPublishedRawWorks(): Promise<RawWorkImage[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return publishedRows(await fetchRawWorks());
  } catch {
    return [];
  }
}

export function subscribeRawWorks(
  cb: (rows: RawWorkImage[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    cb([]);
    return () => {};
  }
  return onSnapshot(
    rawWorksQuery(),
    (snap) => {
      cb(sortByOrder(snap.docs.map((d) => mapRawWork(d.id, d.data()))));
    },
    (err) => {
      console.error(err);
      cb([]);
    }
  );
}

export async function getRawWork(id: string): Promise<RawWorkImage | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const snap = await getDoc(doc(db(), "rawWorks", id));
    if (!snap.exists()) return null;
    return mapRawWork(snap.id, snap.data());
  } catch {
    return null;
  }
}

export async function createRawWork(
  data: Omit<RawWorkImage, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db(), "rawWorks"), {
    ...firestoreWriteData({
      ...data,
      published: data.published !== false,
    }),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRawWork(
  id: string,
  data: Partial<Omit<RawWorkImage, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db(), "rawWorks", id), {
    ...firestoreWriteData(data as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRawWork(id: string): Promise<void> {
  await deleteDoc(doc(db(), "rawWorks", id));
}

// ---------- Published lists (artworks & events) ----------

export async function listPublishedArtworks(): Promise<Artwork[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const { listArtworks } = await import("@/lib/firestore");
    return publishedRows(await listArtworks());
  } catch {
    return [];
  }
}

export async function listPublishedEvents(): Promise<ArtEvent[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const { listEvents } = await import("@/lib/firestore");
    return publishedRows(await listEvents());
  } catch {
    return [];
  }
}

export async function getPublishedArtwork(id: string): Promise<Artwork | null> {
  try {
    const { getArtwork } = await import("@/lib/firestore");
    const row = await getArtwork(id);
    if (row && isPublished(row)) return row;
  } catch {
    // Firestore indisponible
  }
  return null;
}
