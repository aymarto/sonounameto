"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ReferenceForm from "@/components/admin/ReferenceForm";
import { useAuth } from "@/components/AuthProvider";
import { getReference } from "@/lib/firestore-content";
import type { ReferenceItem } from "@/lib/types";

function EditReferenceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, firebaseReady } = useAuth();
  const [item, setItem] = useState<ReferenceItem | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/references");
      return;
    }
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      const r = await getReference(id);
      if (!cancelled) setItem(r);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id, router]);

  if (!id) return null;

  if (item === undefined) {
    return <p className="text-sm text-neutral-500">Chargement…</p>;
  }
  if (item === null) {
    return (
      <AdminHeader
        eyebrow="Références"
        title="Référence introuvable"
        description="Cette entrée n'existe pas ou a été supprimée."
      />
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Références"
        title={item.title || "Modifier la référence"}
        description="Mettez à jour le texte ou l’image."
      />
      <ReferenceForm initial={item} />
    </>
  );
}

export default function EditReferencePage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Chargement…</p>}>
      <EditReferenceContent />
    </Suspense>
  );
}
