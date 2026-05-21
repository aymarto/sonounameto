import { access, copyFile, mkdir } from "fs/promises";
import path from "path";
import type { UploadFolder } from "@/lib/server/upload-folders";
import {
  buildRelativeUploadPath,
  publicUrlFromRelative,
} from "@/lib/server/upload-paths";

const LOCAL_IMAGE_PREFIX = "/images/";

export type MigratedImage = {
  url: string;
  path: string;
};

async function resolveSourcePath(localUrl: string): Promise<string | null> {
  if (!localUrl.startsWith(LOCAL_IMAGE_PREFIX)) return null;
  const filename = localUrl.slice(LOCAL_IMAGE_PREFIX.length);
  const candidates = [
    path.join(process.cwd(), "public", "images", filename),
    path.join(process.cwd(), "images", filename),
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // fichier absent
    }
  }
  return null;
}

/** Copie une image locale /images/… vers public/uploads/{folder}/… */
export async function migrateLocalImage(
  localUrl: string,
  folder: UploadFolder,
  cache: Map<string, MigratedImage>
): Promise<MigratedImage | null> {
  if (localUrl.startsWith("/uploads/")) {
    return { url: localUrl, path: localUrl.replace(/^\//, "") };
  }

  if (!localUrl.startsWith(LOCAL_IMAGE_PREFIX)) {
    return null;
  }

  const cached = cache.get(localUrl);
  if (cached) return cached;

  const source = await resolveSourcePath(localUrl);
  if (!source) return null;

  const relative = buildRelativeUploadPath(folder, path.basename(source));
  const dest = path.join(process.cwd(), "public", relative);
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(source, dest);

  const migrated: MigratedImage = {
    url: publicUrlFromRelative(relative),
    path: relative.replace(/\\/g, "/"),
  };
  cache.set(localUrl, migrated);
  return migrated;
}
