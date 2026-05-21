"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import RawWorkForm from "@/components/admin/RawWorkForm";
import { useAuth } from "@/components/AuthProvider";
import { getRawWork } from "@/lib/firestore-content";
import type { RawWorkImage } from "@/lib/types";

function EditRawWorkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, firebaseReady } = useAuth();
  const [row, setRow] = useState<RawWorkImage | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/travail-brut");
      return;
    }
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      const r = await getRawWork(id);
      if (!cancelled) setRow(r);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id, router]);

  if (!id) return null;

  if (row === undefined) {
    return <p className="text-sm text-neutral-500">Chargement…</p>;
  }
  if (row === null) {
    return (
      <AdminHeader
        eyebrow="Travail brut"
        title="Image introuvable"
        description="Cette image n'existe pas ou a été supprimée."
      />
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Travail brut"
        title="Modifier l’image"
        description="Mettez à jour le fichier, le texte alternatif ou la visibilité."
      />
      <RawWorkForm initial={row} />
    </>
  );
}

export default function EditRawWorkPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Chargement…</p>}>
      <EditRawWorkContent />
    </Suspense>
  );
}
