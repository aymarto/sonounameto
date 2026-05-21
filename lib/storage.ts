"use client";

import { getFirebase } from "@/lib/firebase";
import type { UploadFolder } from "@/lib/server/upload-folders";

export type { UploadFolder };

export type UploadResult = {
  url: string;
  path: string;
};

async function getIdToken(): Promise<string> {
  const fb = getFirebase();
  if (!fb?.auth.currentUser) {
    throw new Error("Connexion admin requise.");
  }
  return fb.auth.currentUser.getIdToken();
}

function uploadWithProgress(
  file: File,
  folder: UploadFolder,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    getIdToken()
      .then((token) => {
        const xhr = new XMLHttpRequest();
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress(event.loaded / event.total);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText) as UploadResult);
            } catch {
              reject(new Error("Réponse serveur invalide."));
            }
            return;
          }
          let message = "L'upload a échoué.";
          try {
            const body = JSON.parse(xhr.responseText) as { error?: string };
            if (body.error) message = body.error;
          } catch {
            /* ignore */
          }
          reject(new Error(message));
        });

        xhr.addEventListener("error", () => {
          reject(new Error("L'upload a échoué."));
        });

        xhr.open("POST", "/api/admin/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(form);
      })
      .catch(reject);
  });
}

export async function uploadImage(
  file: File,
  folder: Exclude<UploadFolder, "portfolio">,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return uploadWithProgress(file, folder, onProgress);
}

export async function uploadFile(
  file: File,
  folder: UploadFolder,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return uploadWithProgress(file, folder, onProgress);
}

export async function deleteImage(path?: string): Promise<void> {
  if (!path) return;

  // Ignorer les anciennes URLs Firebase Storage
  if (path.startsWith("http://") || path.startsWith("https://")) return;

  const relative = path.startsWith("uploads/")
    ? path
    : path.startsWith("/uploads/")
      ? path.slice(1)
      : null;

  if (!relative) return;

  try {
    const token = await getIdToken();
    await fetch(`/api/admin/upload?path=${encodeURIComponent(relative)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Best-effort
  }
}
