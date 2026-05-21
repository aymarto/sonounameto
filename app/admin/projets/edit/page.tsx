"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { useAuth } from "@/components/AuthProvider";
import { getProject } from "@/lib/firestore-content";
import type { Project } from "@/lib/types";

function EditProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user, firebaseReady } = useAuth();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/projets");
      return;
    }
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      const p = await getProject(id);
      if (!cancelled) setProject(p);
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user, id, router]);

  if (!id) return null;

  if (project === undefined) {
    return <p className="text-sm text-neutral-500">Chargement…</p>;
  }
  if (project === null) {
    return (
      <AdminHeader
        eyebrow="Projets"
        title="Projet introuvable"
        description="Ce projet n'existe pas ou a été supprimé."
      />
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Projets"
        title={project.title || "Modifier le projet"}
        description="Modifiez les informations et les œuvres associées."
      />
      <ProjectForm initial={project} />
    </>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Chargement…</p>}>
      <EditProjectContent />
    </Suspense>
  );
}
