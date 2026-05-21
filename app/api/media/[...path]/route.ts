import { readFile, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { absolutePathFromRelative } from "@/lib/server/upload-paths";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }

  if (segments.some((part) => part === ".." || part === ".")) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }

  const relativePath = path.posix.join("uploads", ...segments);
  const absolutePath = absolutePathFromRelative(relativePath);
  if (!absolutePath) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
    }

    const buffer = await readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
