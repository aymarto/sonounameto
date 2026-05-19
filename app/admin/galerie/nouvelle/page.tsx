"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ArtworkForm from "@/components/admin/ArtworkForm";

export default function NewArtworkPage() {
  return (
    <>
      <AdminHeader
        eyebrow="Galerie"
        title="Nouvelle œuvre"
        description="Ajoutez une nouvelle œuvre à votre galerie."
      />
      <ArtworkForm />
    </>
  );
}
