import { NextResponse } from "next/server";
import { isValidFirebaseConfig, resolveFirebaseConfig } from "@/lib/firebase-config";

/** Config Firebase lue au runtime (cPanel) avec repli sur les valeurs par défaut. */
export const dynamic = "force-dynamic";

export async function GET() {
  const config = resolveFirebaseConfig();

  if (!isValidFirebaseConfig(config)) {
    return NextResponse.json({ configured: false as const });
  }

  return NextResponse.json({
    configured: true as const,
    ...config,
  });
}
