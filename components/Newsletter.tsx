"use client";

import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 500));
    setStatus("ok");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section className="bg-ink py-20 text-white md:py-24">
      <div className="container-page grid gap-10 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow text-white/60">Newsletter</p>
          <h2 className="section-title mt-3 text-white">
            Recevez les prochaines œuvres et expositions.
          </h2>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label htmlFor="newsletter-email" className="sr-only">
            Adresse email
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="vous@exemple.com"
              className="w-full border-b border-white/40 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-white"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center border border-white px-6 py-3 text-xs uppercase tracking-wide-xl text-white transition-colors hover:bg-white hover:text-black disabled:opacity-50"
            >
              {status === "sending" ? "Envoi…" : "S'inscrire"}
            </button>
          </div>
          {status === "ok" && (
            <p className="text-xs text-white/70">
              Merci ! Vous êtes inscrit à la newsletter.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
