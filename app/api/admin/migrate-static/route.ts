import { NextResponse } from "next/server";
import { buildMigratedSeedPayload } from "@/lib/server/build-migrated-seed";
import {
  getBearerToken,
  verifyAdminIdToken,
} from "@/lib/server/verify-admin-token";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const admin = await verifyAdminIdToken(token);
  if (!admin) {
    return NextResponse.json({ error: "Session invalide." }, { status: 401 });
  }

  try {
    const payload = await buildMigratedSeedPayload();
    return NextResponse.json(payload);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Migration des fichiers impossible." },
      { status: 500 }
    );
  }
}
