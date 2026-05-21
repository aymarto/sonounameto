import { accessSync, constants } from "fs";
import path from "path";
import type { UploadFolder } from "@/lib/server/upload-folders";

let cachedPublicDir: string | null = null;

/** Racine du dossier public/ (standalone cPanel : à côté de server.js). */
export function getPublicDir(): string {
  if (cachedPublicDir) return cachedPublicDir;

  const candidates = [
    process.env.PUBLIC_DIR,
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "..", "public"),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.R_OK);
      cachedPublicDir = candidate;
      return candidate;
    } catch {
      // essayer le candidat suivant
    }
  }

  cachedPublicDir = path.join(process.cwd(), "public");
  return cachedPublicDir;
}

/** Racine des fichiers servis sous /uploads/… */
export function getUploadsRoot(): string {
  return path.join(getPublicDir(), "uploads");
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

/** Chemin relatif stocké en base (ex. uploads/hero/123-photo.jpg) */
export function buildRelativeUploadPath(
  folder: UploadFolder,
  originalName: string
): string {
  const filename = `${Date.now()}-${sanitizeFilename(originalName)}`;
  return path.posix.join("uploads", folder, filename);
}

/** URL publique servie par Next.js (ex. /api/media/hero/123-photo.jpg) */
export function publicUrlFromRelative(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.startsWith("uploads/")) {
    return `/api/media/${normalized.slice("uploads/".length)}`;
  }
  return `/${normalized}`;
}

/** Accepte /uploads/… ou /api/media/… et renvoie le chemin relatif uploads/… */
export function relativePathFromPublicUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/api/media/")) {
    return `uploads/${trimmed.slice("/api/media/".length)}`;
  }
  if (trimmed.startsWith("/uploads/")) {
    return trimmed.slice(1);
  }
  if (trimmed.startsWith("uploads/")) {
    return trimmed;
  }
  return null;
}

/** Chemin absolu sur le disque à partir du chemin relatif stocké */
export function absolutePathFromRelative(relativePath: string): string | null {
  const normalized = relativePath.replace(/\\/g, "/");
  if (!normalized.startsWith("uploads/")) return null;
  if (normalized.includes("..")) return null;

  const absolute = path.join(getPublicDir(), normalized);
  const root = getUploadsRoot();
  const resolved = path.resolve(absolute);
  const resolvedRoot = path.resolve(root);
  if (!resolved.startsWith(resolvedRoot)) return null;
  return resolved;
}
