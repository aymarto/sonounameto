import Link from "next/link";
import { events } from "@/lib/data";
import { formatDateRange } from "@/lib/format";

export default function EventsPreview() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Agenda</p>
            <h2 className="section-title mt-3">Évènements à venir</h2>
          </div>
          <Link href="/evenements" className="btn-line hidden md:inline-flex">
            Tous les évènements
          </Link>
        </div>

        <ul className="mt-12 divide-y divide-black/10 border-y border-black/10">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="grid gap-2 py-6 md:grid-cols-[200px_1fr_auto] md:items-center md:gap-8 md:py-8"
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

        <div className="mt-10 md:hidden">
          <Link href="/evenements" className="btn-line">
            Tous les évènements
          </Link>
        </div>
      </div>
    </section>
  );
}
