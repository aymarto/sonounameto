"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ReferenceForm from "@/components/admin/ReferenceForm";

export default function NewReferencePage() {
  return (
    <>
      <AdminHeader
        eyebrow="Références"
        title="Nouvelle référence"
        description="Ajoutez une image (logo, capture d’article, etc.)."
      />
      <ReferenceForm />
    </>
  );
}
