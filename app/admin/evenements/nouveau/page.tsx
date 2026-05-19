"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <>
      <AdminHeader
        eyebrow="Évènements"
        title="Nouvel évènement"
        description="Ajoutez une exposition, une résidence ou un salon."
      />
      <EventForm />
    </>
  );
}
