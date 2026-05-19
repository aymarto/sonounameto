"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import EventForm from "@/components/admin/EventForm";
import { useAuth } from "@/components/AuthProvider";
import { getEvent } from "@/lib/firestore";
import type { ArtEvent } from "@/lib/types";

function EditEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, firebaseReady } = useAuth();
  const [event, setEvent] = useState<ArtEvent | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/evenements");
      return;
    }
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      const e = await getEvent(id);
      if (!cancelled) setEvent(e);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id, router]);

  if (!id) return null;

  if (event === undefined) {
    return <p className="text-sm text-neutral-500">Chargement…</p>;
  }
  if (event === null) {
    return (
      <AdminHeader
        eyebrow="Évènements"
        title="Évènement introuvable"
        description="Cet évènement n'existe pas ou a été supprimé."
      />
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Évènements"
        title={event.title || "Modifier l'évènement"}
        description="Modifiez les informations de cet évènement."
      />
      <EventForm initial={event} />
    </>
  );
}

export default function EditEventPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Chargement…</p>}>
      <EditEventContent />
    </Suspense>
  );
}
