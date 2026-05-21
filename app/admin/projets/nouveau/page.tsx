"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader
        eyebrow="Projets"
        title="Nouveau projet"
        description="Créez un projet et associez-y des œuvres déjà publiées dans la base."
      />
      <ProjectForm />
    </>
  );
}
