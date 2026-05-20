import Image from "next/image";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";
import { events } from "@/lib/data";
import { formatDateRange } from "@/lib/format";

export const metadata: Metadata = {
  title: pageTitle("Expositions & Évènements"),
  description: `Expositions et évènements de ${ARTIST_NAME}.`,
};

export default function EvenementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Expositions & Évènements"
        description="Expositions, résidences et salons. Les prochains rendez-vous pour découvrir les œuvres en personne."
      />

      <section className="page-content">
        <div className="container-page space-y-10 md:space-y-12">
          {events.map((ev, i) => (
            <article
              key={ev.id}
              id={ev.id}
              className={`grid gap-6 md:grid-cols-2 md:items-center md:gap-10 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {ev.imageUrl && (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={ev.imageUrl}
                    alt={ev.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="eyebrow">
                  {formatDateRange(ev.startDate, ev.endDate)}
                </p>
                <h2 className="section-title mt-2">{ev.title}</h2>
                <p className="mt-1 text-sm uppercase tracking-wide-xl text-neutral-500">
                  {ev.location}
                </p>
                <p className="mt-4 max-w-xl text-neutral-700 leading-relaxed">
                  {ev.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
