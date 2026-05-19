"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // Firebase wiring will be added later.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("ok");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-1">
        <label htmlFor="name" className="eyebrow block">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Votre nom"
          className="input-line mt-2"
        />
      </div>
      <div className="md:col-span-1">
        <label htmlFor="email" className="eyebrow block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="vous@exemple.com"
          className="input-line mt-2"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="subject" className="eyebrow block">
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Acquisition, collaboration, exposition…"
          className="input-line mt-2"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="message" className="eyebrow block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Votre message"
          className="input-line mt-2 resize-none"
        />
      </div>

      <div className="md:col-span-2 flex items-center justify-between gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-line disabled:opacity-50"
        >
          {status === "sending" ? "Envoi…" : "Envoyer le message"}
        </button>
        {status === "ok" && (
          <p className="text-sm text-neutral-600">
            Merci, votre message a été envoyé.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">
            Une erreur est survenue. Réessayez.
          </p>
        )}
      </div>
    </form>
  );
}
