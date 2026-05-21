import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  absolutePathFromRelative,
  buildRelativeUploadPath,
  getPublicDir,
  getUploadsRoot,
  publicUrlFromRelative,
} from "@/lib/server/upload-paths";
import {
  isAllowedMime,
  isUploadFolder,
  maxBytesForFolder,
} from "@/lib/server/upload-folders";
import {
  getBearerToken,
  verifyAdminIdToken,
} from "@/lib/server/verify-admin-token";

export const runtime = "nodejs";

async function requireAdmin(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return { error: NextResponse.json({ error: "Non autorisé." }, { status: 401 }) };
  }
  const admin = await verifyAdminIdToken(token);
  if (!admin) {
    return { error: NextResponse.json({ error: "Session invalide." }, { status: 401 }) };
  }
  return { admin };
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth && auth.error) return auth.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const folderRaw = formData.get("folder");
  const file = formData.get("file");

  if (typeof folderRaw !== "string" || !isUploadFolder(folderRaw)) {
    return NextResponse.json({ error: "Dossier invalide." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  const folder = folderRaw;
  const mime = file.type || "application/octet-stream";

  if (!isAllowedMime(folder, mime)) {
    return NextResponse.json({ error: "Type de fichier non autorisé." }, { status: 400 });
  }

  if (file.size > maxBytesForFolder(folder)) {
    return NextResponse.json({ error: "Fichier trop volumineux." }, { status: 400 });
  }

  const relativePath = buildRelativeUploadPath(folder, file.name);
  const absolutePath = absolutePathFromRelative(relativePath);
  if (!absolutePath) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }

  await mkdir(path.dirname(absolutePath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return NextResponse.json({
    url: publicUrlFromRelative(relativePath),
    path: relativePath.replace(/\\/g, "/"),
  });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth && auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get("path");

  if (!relativePath) {
    return NextResponse.json({ error: "Chemin manquant." }, { status: 400 });
  }

  const absolutePath = absolutePathFromRelative(relativePath);
  if (!absolutePath) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }

  try {
    await unlink(absolutePath);
  } catch {
    // Fichier déjà absent — OK
  }

  return NextResponse.json({ ok: true });
}

/** Santé : vérifie que le dossier uploads est accessible en écriture */
export async function GET() {
  try {
    const root = getUploadsRoot();
    await mkdir(root, { recursive: true });
    return NextResponse.json({
      ok: true,
      root,
      publicDir: getPublicDir(),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
