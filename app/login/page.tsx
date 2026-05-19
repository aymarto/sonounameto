"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") || "/admin";
  const { user, loading, firebaseReady, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      router.replace(redirectTo);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("Identifiants invalides.");
      } else if (code === "auth/too-many-requests") {
        setError("Trop de tentatives. Réessayez plus tard.");
      } else {
        setError("Connexion impossible. Réessayez.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && !firebaseReady) {
    return (
      <div className="border border-black/10 bg-white p-8 text-sm text-neutral-500">
        Chargement de la configuration…
      </div>
    );
  }

  if (!firebaseReady) {
    return (
      <div className="border border-black/20 bg-white p-6 text-sm">
        <p className="eyebrow mb-3">Firebase non détecté</p>
        <p className="text-neutral-700">
          En production, ajoute les variables{" "}
          <code className="bg-neutral-100 px-1">NEXT_PUBLIC_FIREBASE_*</code>{" "}
          dans cPanel → Setup Node.js App → Environment variables, puis{" "}
          <strong>Restart</strong> l&apos;application.
        </p>
        <p className="mt-3 text-neutral-600">
          En local : fichier{" "}
          <code className="bg-neutral-100 px-1">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-black/10 bg-white p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="eyebrow block">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-line mt-2"
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="eyebrow block">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-line mt-2"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full border border-black bg-black py-3 text-xs uppercase tracking-wide-xl text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            className="font-display text-2xl tracking-wide-xl uppercase"
          >
            SONOUNAMETO
          </Link>
          <p className="eyebrow mt-4">Espace privé</p>
          <h1 className="section-title mt-2">Connexion</h1>
        </div>

        <Suspense
          fallback={
            <div className="border border-black/10 bg-white p-8 text-sm text-neutral-500">
              Chargement…
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-wide-xl text-neutral-500 hover:text-black"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </main>
  );
}
