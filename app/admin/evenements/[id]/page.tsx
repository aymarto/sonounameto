"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import EventForm from "@/components/admin/EventForm";
import { useAuth } from "@/components/AuthProvider";
import { getEvent } from "@/lib/firestore";
import type { ArtEvent } from "@/lib/types";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { user, firebaseReady } = useAuth();
  const [event, setEvent] = useState<ArtEvent | null | undefined>(undefined);

  useEffect(() => {
    if (!firebaseReady || !user || !id) return;
    let cancelled = false;
    (async () => {
      const e = await getEvent(id);
      if (!cancelled) setEvent(e);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id]);

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
