"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ArtworkForm from "@/components/admin/ArtworkForm";

export default function NewOeuvrePage() {
  return (
    <>
      <AdminHeader
        eyebrow="Œuvres"
        title="Nouvelle œuvre"
        description="Ajoutez une nouvelle œuvre à votre galerie."
      />
      <ArtworkForm />
    </>
  );
}
