"use client";

import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebase } from "@/lib/firebase";

export type UploadResult = {
  url: string;
  path: string;
};

function storage() {
  const fb = getFirebase();
  if (!fb) throw new Error("Firebase n'est pas configuré.");
  return fb.storage;
}

export async function uploadImage(
  file: File,
  folder: "artworks" | "events" | "hero",
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const ref = storageRef(storage(), path);

  const task = uploadBytesResumable(ref, file, {
    contentType: file.type,
  });

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          onProgress(snap.bytesTransferred / snap.totalBytes);
        }
      },
      (err) => reject(err),
      () => resolve()
    );
  });

  const url = await getDownloadURL(task.snapshot.ref);
  return { url, path };
}

export async function deleteImage(path?: string): Promise<void> {
  if (!path) return;
  try {
    await deleteObject(storageRef(storage(), path));
  } catch {
    // Ignore missing-file errors
  }
}
