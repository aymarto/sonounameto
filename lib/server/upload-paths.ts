import path from "path";
import type { UploadFolder } from "@/lib/server/upload-folders";

/** Racine des fichiers servis sous /uploads/… */
export function getUploadsRoot(): string {
  return path.join(process.cwd(), "public", "uploads");
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

/** URL publique (ex. /uploads/hero/123-photo.jpg) */
export function publicUrlFromRelative(relativePath: string): string {
  return `/${relativePath.replace(/\\/g, "/")}`;
}

/** Chemin absolu sur le disque à partir du chemin relatif stocké */
export function absolutePathFromRelative(relativePath: string): string | null {
  const normalized = relativePath.replace(/\\/g, "/");
  if (!normalized.startsWith("uploads/")) return null;
  if (normalized.includes("..")) return null;

  const absolute = path.join(process.cwd(), "public", normalized);
  const root = getUploadsRoot();
  if (!absolute.startsWith(root)) return null;
  return absolute;
}
