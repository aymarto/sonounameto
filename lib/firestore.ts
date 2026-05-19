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
  setDoc,
  updateDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import type { Artwork, ArtEvent, HeroSettings } from "@/lib/types";
import { DEFAULT_HERO } from "@/lib/types";
import { getLocalHeroFallback, normalizeHeroSettings } from "@/lib/hero";
import { isFirebaseConfigured } from "@/lib/firebase";

function db() {
  const fb = getFirebase();
  if (!fb) throw new Error("Firebase n'est pas configuré.");
  return fb.db;
}

function toISO(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  // Firestore Timestamp
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return undefined;
}

function mapGalleryImages(data: DocumentData): Artwork["galleryImages"] {
  if (!Array.isArray(data.galleryImages)) return [];
  return data.galleryImages
    .filter((item) => item && typeof item.url === "string")
    .map((item) => ({
      url: item.url as string,
      path: typeof item.path === "string" ? item.path : undefined,
      alt: typeof item.alt === "string" ? item.alt : undefined,
    }));
}

function mapArtwork(id: string, data: DocumentData): Artwork {
  return {
    id,
    title: data.title ?? "",
    shortDescription: data.shortDescription ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    imageUrl: data.imageUrl ?? "",
    imagePath: data.imagePath,
    galleryImages: mapGalleryImages(data),
    medium: data.medium,
    dimensions: data.dimensions,
    order: data.order,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

function mapEvent(id: string, data: DocumentData): ArtEvent {
  return {
    id,
    title: data.title ?? "",
    location: data.location ?? "",
    startDate: data.startDate ?? "",
    endDate: data.endDate,
    description: data.description ?? "",
    imageUrl: data.imageUrl,
    imagePath: data.imagePath,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// ---------- Artworks ----------

export async function listArtworks(): Promise<Artwork[]> {
  const snap = await getDocs(
    query(collection(db(), "artworks"), orderBy("date", "desc"))
  );
  return snap.docs.map((d) => mapArtwork(d.id, d.data()));
}

export function subscribeArtworks(cb: (rows: Artwork[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db(), "artworks"), orderBy("date", "desc")),
    (snap) => cb(snap.docs.map((d) => mapArtwork(d.id, d.data())))
  );
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  const ref = doc(db(), "artworks", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapArtwork(snap.id, snap.data());
}

export async function createArtwork(
  data: Omit<Artwork, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db(), "artworks"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateArtwork(
  id: string,
  data: Partial<Omit<Artwork, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db(), "artworks", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteArtwork(id: string): Promise<void> {
  await deleteDoc(doc(db(), "artworks", id));
}

// ---------- Events ----------

export async function listEvents(): Promise<ArtEvent[]> {
  const snap = await getDocs(
    query(collection(db(), "events"), orderBy("startDate", "desc"))
  );
  return snap.docs.map((d) => mapEvent(d.id, d.data()));
}

export function subscribeEvents(cb: (rows: ArtEvent[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db(), "events"), orderBy("startDate", "desc")),
    (snap) => cb(snap.docs.map((d) => mapEvent(d.id, d.data())))
  );
}

export async function getEvent(id: string): Promise<ArtEvent | null> {
  const ref = doc(db(), "events", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapEvent(snap.id, snap.data());
}

export async function createEvent(
  data: Omit<ArtEvent, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db(), "events"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<ArtEvent, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db(), "events", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db(), "events", id));
}

// ---------- Hero settings ----------

export async function getHero(): Promise<HeroSettings> {
  if (!isFirebaseConfigured()) {
    return getLocalHeroFallback();
  }

  try {
    const ref = doc(db(), "settings", "hero");
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return getLocalHeroFallback();
    }
    return normalizeHeroSettings(snap.data() as Partial<HeroSettings>);
  } catch {
    return getLocalHeroFallback();
  }
}

export async function setHero(data: HeroSettings): Promise<void> {
  const normalized = normalizeHeroSettings(data);
  await setDoc(doc(db(), "settings", "hero"), {
    slides: normalized.slides,
    title: normalized.title,
    subtitle: normalized.subtitle,
    description: normalized.description,
    updatedAt: serverTimestamp(),
  });
}
