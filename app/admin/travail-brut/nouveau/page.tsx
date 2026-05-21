"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import RawWorkForm from "@/components/admin/RawWorkForm";

export default function NewRawWorkPage() {
  return (
    <>
      <AdminHeader
        eyebrow="Travail brut"
        title="Nouvelle image"
        description="Ajoutez une image de travail brut (croquis, essai, etc.)."
      />
      <RawWorkForm />
    </>
  );
}
