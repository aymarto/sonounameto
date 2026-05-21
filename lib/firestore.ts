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
import type { Artwork, ArtEvent, HeroSettings, SiteSettings } from "@/lib/types";
import { normalizeHeroSettings } from "@/lib/hero";
import {
  EMPTY_SITE_SETTINGS,
  normalizeSiteSettings,
} from "@/lib/site-settings";
import { isFirebaseConfigured } from "@/lib/firebase";
import { firestoreWriteData } from "@/lib/firestore-write";

function db() {
  const fb = getFirebase();
  if (!fb) throw new Error("Firebase n'est pas configuré.");
  return fb.db;
}

/** @deprecated Importez firestoreWriteData depuis @/lib/firestore-write */
export { firestoreWriteData, withoutUndefined } from "@/lib/firestore-write";

function artworkWritePayload(
  data: Partial<Omit<Artwork, "id" | "createdAt">>
): Record<string, unknown> {
  return firestoreWriteData(data as Record<string, unknown>);
}

function eventWritePayload(
  data: Partial<Omit<ArtEvent, "id" | "createdAt">>
): Record<string, unknown> {
  return firestoreWriteData(data as Record<string, unknown>);
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
    published: data.published !== false,
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
    category:
      data.category === "exposition" || data.category === "evenement"
        ? data.category
        : undefined,
    imageUrl: data.imageUrl,
    imagePath: data.imagePath,
    published: data.published !== false,
    order: data.order,
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
    (snap) => cb(snap.docs.map((d) => mapArtwork(d.id, d.data()))),
    (err) => {
      console.error(err);
      cb([]);
    }
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
    ...artworkWritePayload(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateArtwork(
  id: string,
  data: Partial<Omit<Artwork, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(
    doc(db(), "artworks", id),
    firestoreWriteData({
      ...artworkWritePayload(data),
      updatedAt: serverTimestamp(),
    })
  );
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
    (snap) => cb(snap.docs.map((d) => mapEvent(d.id, d.data()))),
    (err) => {
      console.error(err);
      cb([]);
    }
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
    ...eventWritePayload(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<ArtEvent, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(
    doc(db(), "events", id),
    firestoreWriteData({
      ...eventWritePayload(data),
      updatedAt: serverTimestamp(),
    })
  );
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db(), "events", id));
}

// ---------- Hero settings ----------

export async function getHero(): Promise<HeroSettings | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const ref = doc(db(), "settings", "hero");
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    return normalizeHeroSettings(snap.data() as Partial<HeroSettings>);
  } catch {
    return null;
  }
}

export async function setHero(data: HeroSettings): Promise<void> {
  const normalized = normalizeHeroSettings(data);
  await setDoc(
    doc(db(), "settings", "hero"),
    firestoreWriteData({
      slides: normalized.slides.map((slide) => ({
        imageUrl: slide.imageUrl,
        ...(slide.imagePath ? { imagePath: slide.imagePath } : {}),
      })),
      eyebrow: normalized.eyebrow,
      artistName: normalized.artistName,
      taglineLine1: normalized.taglineLine1,
      taglineLine2: normalized.taglineLine2,
      description: normalized.description,
      updatedAt: serverTimestamp(),
    })
  );
}

// ---------- Site settings ----------

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseConfigured()) {
    return { ...EMPTY_SITE_SETTINGS };
  }

  try {
    const ref = doc(db(), "settings", "site");
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { ...EMPTY_SITE_SETTINGS };
    }
    return normalizeSiteSettings(snap.data() as Partial<SiteSettings>);
  } catch {
    return { ...EMPTY_SITE_SETTINGS };
  }
}

export async function setSiteSettings(data: SiteSettings): Promise<void> {
  const n = normalizeSiteSettings(data);
  const payload: Record<string, unknown> = {
    galleryName: n.galleryName,
    footerText: n.footerText,
    contactEmail: n.contactEmail,
    contactInstagram: n.contactInstagram,
    contactFacebook: n.contactFacebook,
    contactLocation: n.contactLocation,
    portfolioUrl: n.portfolioUrl,
    aboutEyebrow: n.aboutEyebrow,
    aboutTitle: n.aboutTitle,
    aboutDescription: n.aboutDescription,
    aboutImageUrl: n.aboutImageUrl,
    updatedAt: serverTimestamp(),
  };
  if (n.portfolioPath) payload.portfolioPath = n.portfolioPath;
  if (n.aboutImagePath) payload.aboutImagePath = n.aboutImagePath;
  await setDoc(doc(db(), "settings", "site"), firestoreWriteData(payload));
}
