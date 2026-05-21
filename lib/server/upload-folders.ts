export const UPLOAD_FOLDERS = [
  "artworks",
  "events",
  "hero",
  "about",
  "portfolio",
  "projects",
  "references",
  "raw-work",
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function isAllowedMime(folder: UploadFolder, mime: string): boolean {
  if (folder === "portfolio") return mime === "application/pdf";
  return IMAGE_MIME.has(mime);
}

export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export function maxBytesForFolder(folder: UploadFolder): number {
  return folder === "portfolio" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
}
