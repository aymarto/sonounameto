"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { useAuth } from "@/components/AuthProvider";
import { getArtwork } from "@/lib/firestore";
import type { Artwork } from "@/lib/types";

export default function EditArtworkPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { user, firebaseReady } = useAuth();
  const [artwork, setArtwork] = useState<Artwork | null | undefined>(undefined);

  useEffect(() => {
    if (!firebaseReady || !user || !id) return;
    let cancelled = false;
    (async () => {
      const a = await getArtwork(id);
      if (!cancelled) setArtwork(a);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id]);

  if (artwork === undefined) {
    return <p className="text-sm text-neutral-500">Chargement…</p>;
  }
  if (artwork === null) {
    return (
      <>
        <AdminHeader
          eyebrow="Galerie"
          title="Œuvre introuvable"
          description="Cette œuvre n'existe pas ou a été supprimée."
        />
      </>
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
