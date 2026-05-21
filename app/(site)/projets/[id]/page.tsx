import type { Metadata } from "next";
import ProjetDetailContent from "@/components/ProjetDetailContent";
import { pageTitle } from "@/lib/brand";
import { getProject } from "@/lib/site-content";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const project = getProject(params.id);
  if (!project) return { title: pageTitle("Projet") };
  return {
    title: pageTitle(project.title),
    description: `Œuvres du projet ${project.title}.`,
  };
}

export default function ProjetDetailPage({ params }: Props) {
  return <ProjetDetailContent id={params.id} />;
}
