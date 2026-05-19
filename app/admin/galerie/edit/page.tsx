"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { useAuth } from "@/components/AuthProvider";
import { getArtwork } from "@/lib/firestore";
import type { Artwork } from "@/lib/types";

function EditArtworkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, firebaseReady } = useAuth();
  const [artwork, setArtwork] = useState<Artwork | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/galerie");
      return;
    }
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      const a = await getArtwork(id);
      if (!cancelled) setArtwork(a);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id, router]);

  if (!id) return null;

  if (artwork === undefined) {
    return <p className="text-sm text-neutral-500">Chargement…</p>;
  }
  if (artwork === null) {
    return (
      <AdminHeader
        eyebrow="Galerie"
        title="Œuvre introuvable"
        description="Cette œuvre n'existe pas ou a été supprimée."
      />
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Galerie"
        title={artwork.title || "Modifier l'œuvre"}
        description="Modifiez les informations de cette œuvre."
      />
      <ArtworkForm initial={artwork} />
    </>
  );
}

export default function EditArtworkPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Chargement…</p>}>
      <EditArtworkContent />
    </Suspense>
  );
}
