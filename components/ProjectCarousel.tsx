"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { projects as allProjects } from "@/lib/site-content";
import type { Project } from "@/lib/types";

type Props = {
  limit?: number;
  items?: Project[];
  showHint?: boolean;
  /** Accueil : centré comme le reste du contenu ; Projets : pleine largeur */
  layout?: "contained" | "full";
};

export default function ProjectCarousel({
  limit,
  items,
  showHint = true,
  layout = "full",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const list = items ?? (limit ? allProjects.slice(0, limit) : allProjects);

  useEffect(() => {
    const track = trackRef.current;
    const row = track?.querySelector<HTMLElement>(".projects-track__list");
    if (!track || !row) return;

    const updateCentered = () => {
      const fits = row.scrollWidth <= track.clientWidth + 8;
      track.classList.toggle("projects-track--centered", fits);
    };

    updateCentered();
    window.addEventListener("resize", updateCentered);
    return () => window.removeEventListener("resize", updateCentered);
  }, [list.length]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    el.classList.remove("is-dragging");
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }, []);

  const sectionClass =
    layout === "contained"
      ? "projects-section projects-section--contained"
      : "projects-section projects-section--full";

  return (
    <div className={sectionClass}>
      {showHint && (
        <p className="mb-3 text-[10px] uppercase tracking-wide-xl text-neutral-400">
          Glisser pour parcourir →
        </p>
      )}

      <div
        ref={trackRef}
        className="projects-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <ul className="projects-track__list">
          {list.map((project, index) => (
            <li key={project.id} className="projects-track__item">
              <Link
                href={`/projets/${project.id}`}
                className="group block"
                draggable={false}
              >
                <article className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                  <Image
                    src={project.coverImageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 82vw, 380px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-wide-xl text-white/60">
                      {String(index + 1).padStart(2, "0")} — Projet
                    </p>
                    <h2 className="mt-1 font-display text-2xl leading-tight text-white md:text-3xl">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-xs text-white/75">
                      {project.artworkIds.length} œuvre
                      {project.artworkIds.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </article>
              </Link>
            </li>
          ))}
          <li className="projects-track__spacer" aria-hidden />
        </ul>
      </div>
    </div>
  );
}
