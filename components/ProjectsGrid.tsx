import Image from "next/image";
import Link from "next/link";
import ContentUnavailable from "@/components/ContentUnavailable";
import type { Project } from "@/lib/types";

type Props = {
  items: Project[];
};

export default function ProjectsGrid({ items }: Props) {
  if (items.length === 0) {
    return <ContentUnavailable />;
  }

  return (
    <div className="container-page grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10">
      {items.map((project, index) => (
        <Link
          key={project.id}
          href={`/projets/${project.id}`}
          className="group block"
        >
          <article className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
              quality={75}
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p className="text-[10px] uppercase tracking-wide-xl text-white/60">
                {String(index + 1).padStart(2, "0")} — Projet
              </p>
              <h2 className="mt-1 font-display text-xl leading-tight text-white md:text-2xl">
                {project.title}
              </h2>
              <p className="mt-1 text-xs text-white/75">
                {project.artworkIds.length} œuvre
                {project.artworkIds.length > 1 ? "s" : ""}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
