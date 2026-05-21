"use client";

import {
  doc,
  serverTimestamp,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { firestoreWriteData } from "@/lib/firestore-write";
import type { MigrationResult, MigratedSeedPayload } from "@/lib/migration/types";

export async function writeMigratedSeedToFirestore(
  payload: MigratedSeedPayload
): Promise<MigrationResult> {
  const fb = getFirebase();
  if (!fb) throw new Error("Firebase n'est pas configuré.");

  const batch = writeBatch(fb.db);
  const now = serverTimestamp();

  payload.artworks.forEach((art) => {
    const { id, createdAt, updatedAt, ...rest } = art;
    batch.set(
      doc(fb.db, "artworks", id),
      firestoreWriteData({
        ...rest,
        createdAt: now,
        updatedAt: now,
      }) as DocumentData
    );
  });

  payload.events.forEach((ev) => {
    const { id, createdAt, updatedAt, ...rest } = ev;
    batch.set(
      doc(fb.db, "events", id),
      firestoreWriteData({
        ...rest,
        createdAt: now,
        updatedAt: now,
      }) as DocumentData
    );
  });

  payload.projects.forEach((project) => {
    const { id, createdAt, updatedAt, ...rest } = project;
    batch.set(
      doc(fb.db, "projects", id),
      firestoreWriteData({
        ...rest,
        createdAt: now,
        updatedAt: now,
      }) as DocumentData
    );
  });

  payload.references.forEach((ref) => {
    const { id, createdAt, updatedAt, ...rest } = ref;
    batch.set(
      doc(fb.db, "references", id),
      firestoreWriteData({
        ...rest,
        createdAt: now,
        updatedAt: now,
      }) as DocumentData
    );
  });

  payload.rawWorks.forEach((raw) => {
    const { id, createdAt, updatedAt, ...rest } = raw;
    batch.set(
      doc(fb.db, "rawWorks", id),
      firestoreWriteData({
        ...rest,
        createdAt: now,
        updatedAt: now,
      }) as DocumentData
    );
  });

  const hero = payload.hero;
  batch.set(
    doc(fb.db, "settings", "hero"),
    firestoreWriteData({
      slides: hero.slides.map((slide) => ({
        imageUrl: slide.imageUrl,
        ...(slide.imagePath ? { imagePath: slide.imagePath } : {}),
      })),
      eyebrow: hero.eyebrow,
      artistName: hero.artistName,
      taglineLine1: hero.taglineLine1,
      taglineLine2: hero.taglineLine2,
      description: hero.description,
      updatedAt: now,
    }) as DocumentData
  );

  const site = payload.site;
  batch.set(
    doc(fb.db, "settings", "site"),
    firestoreWriteData({
      galleryName: site.galleryName,
      footerText: site.footerText,
      contactEmail: site.contactEmail,
      contactInstagram: site.contactInstagram,
      contactFacebook: site.contactFacebook,
      contactLocation: site.contactLocation,
      portfolioUrl: site.portfolioUrl,
      ...(site.portfolioPath ? { portfolioPath: site.portfolioPath } : {}),
      aboutEyebrow: site.aboutEyebrow,
      aboutTitle: site.aboutTitle,
      aboutDescription: site.aboutDescription,
      aboutImageUrl: site.aboutImageUrl,
      ...(site.aboutImagePath ? { aboutImagePath: site.aboutImagePath } : {}),
      updatedAt: now,
    }) as DocumentData
  );

  await batch.commit();

  return {
    artworks: payload.artworks.length,
    events: payload.events.length,
    projects: payload.projects.length,
    references: payload.references.length,
    rawWorks: payload.rawWorks.length,
    settings: 2,
    imagesCopied: payload.stats.imagesCopied,
    missingImages: payload.stats.missingImages,
  };
}

export async function runStaticMigration(
  idToken: string
): Promise<MigrationResult> {
  const res = await fetch("/api/admin/migrate-static", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Migration des fichiers impossible.");
  }

  const payload = (await res.json()) as MigratedSeedPayload;
  return writeMigratedSeedToFirestore(payload);
}
