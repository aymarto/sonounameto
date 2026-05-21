import Link from "next/link";
import ContentUnavailable from "@/components/ContentUnavailable";
import { formatDateRange } from "@/lib/format";
import type { ArtEvent } from "@/lib/types";

type Props = {
  events: ArtEvent[];
};

export default function EventsPreview({ events }: Props) {
  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Agenda</p>
            <h2 className="section-title mt-2">Expositions & évènements</h2>
          </div>
          {events.length > 0 && (
            <Link href="/evenements" className="btn-line hidden md:inline-flex">
              Voir tout
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <ContentUnavailable className="py-12" />
        ) : (
          <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="grid gap-2 py-5 md:grid-cols-[200px_1fr_auto] md:items-center md:gap-6 md:py-6"
              >
                <p className="text-xs uppercase tracking-wide-xl text-neutral-500">
                  {formatDateRange(ev.startDate, ev.endDate)}
                </p>
                <div>
                  <h3 className="font-display text-2xl leading-tight">
                    {ev.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">{ev.location}</p>
                </div>
                <Link
                  href={`/evenements#${ev.id}`}
                  className="text-xs uppercase tracking-wide-xl text-neutral-700 hover:text-black"
                >
                  En savoir plus →
                </Link>
              </li>
            ))}
          </ul>
        )}

        {events.length > 0 && (
          <div className="mt-6 md:hidden">
            <Link href="/evenements" className="btn-line">
              Voir tout
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
