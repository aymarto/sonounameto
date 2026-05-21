"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUploader from "@/components/admin/ImageUploader";
import PdfUploader from "@/components/admin/PdfUploader";
import { useAuth } from "@/components/AuthProvider";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { getSiteSettings, setSiteSettings } from "@/lib/firestore";
import { EMPTY_SITE_SETTINGS } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/types";

const TABS = [
  { id: "galerie", label: "Informations de la galerie" },
  { id: "footer", label: "Footer" },
  { id: "contact", label: "Contact" },
  { id: "about", label: "À propos" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTabId(value: string | null): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

function Field({
  label,
  id,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  const className = "input-line mt-2 w-full resize-none";
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {multiline ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </div>
  );
}

export default function AdminSitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, firebaseReady } = useAuth();
  const { refresh: refreshSiteSettings } = useSiteSettings();
  const [site, setSiteState] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("galerie");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (isTabId(tab)) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!firebaseReady || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getSiteSettings();
        if (!cancelled) setSiteState(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setSiteState(EMPTY_SITE_SETTINGS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseReady, user]);

  function selectTab(tab: TabId) {
    setActiveTab(tab);
    router.replace(`/admin/site?tab=${tab}`, { scroll: false });
  }

  function patch(partial: Partial<SiteSettings>) {
    if (!site) return;
    const clean = Object.fromEntries(
      Object.entries(partial).filter(([, value]) => value !== undefined)
    ) as Partial<SiteSettings>;
    setSiteState({ ...site, ...clean });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!site) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await setSiteSettings(site);
      await refreshSiteSettings();
      setStatus("Modifications enregistrées.");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Enregistrement impossible.";
      if (
        message.includes("permission") ||
        message.includes("PERMISSION_DENIED")
      ) {
        setError(
          "Accès Firestore refusé. Dans Firebase Console → Firestore Database → Règles, collez le contenu du fichier firestore.rules du projet, publiez, puis réessayez (connecté en admin)."
        );
      } else if (message.includes("not found") || message.includes("NOT_FOUND")) {
        setError(
          "Firestore n'est pas activé. Créez une base de données dans la console Firebase (Build → Firestore → Create database), puis réessayez."
        );
      } else {
        setError("Enregistrement impossible. Vérifiez la console du navigateur.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!site) {
    return (
      <>
        <AdminHeader
          eyebrow="Site"
          title="Contenu du site"
          description="Marque, footer, contact, à propos."
        />
        <p className="text-sm text-neutral-500">Chargement…</p>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        eyebrow="Site"
        title="Contenu du site"
        description="Choisissez une section dans le menu ci-dessous."
      />

      <form onSubmit={handleSubmit} className="mt-2">
        <div className="grid gap-8 md:grid-cols-[14rem_minmax(0,1fr)]">
          <nav
            className="flex gap-2 overflow-x-auto border-b border-black/10 pb-px md:flex-col md:overflow-visible md:border-b-0 md:border-r md:pb-0 md:pr-6"
            role="tablist"
            aria-label="Sections du contenu du site"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => selectTab(tab.id)}
                  className={`shrink-0 px-4 py-3 text-left text-xs uppercase tracking-wide-xl transition-colors md:w-full md:rounded-sm ${
                    selected
                      ? "bg-black text-white md:shadow-none"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="min-h-[20rem] space-y-4"
          >
            {activeTab === "galerie" && (
              <>
                <h2 className="font-display text-2xl">Informations de la galerie</h2>
                <p className="text-sm text-neutral-600">
                  Nom affiché dans le header, le preloader et le copyright du
                  footer.
                </p>
                <Field
                  label="Nom de la galerie"
                  id="galleryName"
                  value={site.galleryName}
                  onChange={(galleryName) => patch({ galleryName })}
                />
              </>
            )}

            {activeTab === "footer" && (
              <>
                <h2 className="font-display text-2xl">Footer</h2>
                <p className="text-sm text-neutral-600">
                  Texte descriptif sous le logo, en bas de chaque page.
                </p>
                <Field
                  label="Texte sous le logo"
                  id="footerText"
                  value={site.footerText}
                  onChange={(footerText) => patch({ footerText })}
                  multiline
                />
              </>
            )}

            {activeTab === "contact" && (
              <>
                <h2 className="font-display text-2xl">Contact</h2>
                <p className="text-sm text-neutral-600">
                  Coordonnées et liens affichés sur la page contact, le footer et
                  les icônes réseaux sociaux.
                </p>
                <Field
                  label="Email"
                  id="contactEmail"
                  value={site.contactEmail}
                  onChange={(contactEmail) => patch({ contactEmail })}
                />
                <Field
                  label="Instagram (URL complète)"
                  id="contactInstagram"
                  value={site.contactInstagram}
                  onChange={(contactInstagram) => patch({ contactInstagram })}
                />
                <Field
                  label="Facebook (URL complète)"
                  id="contactFacebook"
                  value={site.contactFacebook}
                  onChange={(contactFacebook) => patch({ contactFacebook })}
                />
                <Field
                  label="Localisation / atelier"
                  id="contactLocation"
                  value={site.contactLocation}
                  onChange={(contactLocation) => patch({ contactLocation })}
                />
                <PdfUploader
                  label="Portfolio PDF"
                  value={
                    site.portfolioUrl || site.portfolioPath
                      ? {
                          url: site.portfolioUrl,
                          path: site.portfolioPath,
                          name: "portfolio.pdf",
                        }
                      : undefined
                  }
                  onChange={(value) =>
                    patch({
                      portfolioUrl: value?.url ?? "",
                      ...(value?.path ? { portfolioPath: value.path } : {}),
                    })
                  }
                />
              </>
            )}

            {activeTab === "about" && (
              <>
                <h2 className="font-display text-2xl">À propos</h2>
                <p className="text-sm text-neutral-600">
                  Bloc « À propos » sur la page d&apos;accueil.
                </p>
                <Field
                  label="Sur-titre"
                  id="aboutEyebrow"
                  value={site.aboutEyebrow}
                  onChange={(aboutEyebrow) => patch({ aboutEyebrow })}
                />
                <Field
                  label="Titre"
                  id="aboutTitle"
                  value={site.aboutTitle}
                  onChange={(aboutTitle) => patch({ aboutTitle })}
                />
                <Field
                  label="Description"
                  id="aboutDescription"
                  value={site.aboutDescription}
                  onChange={(aboutDescription) => patch({ aboutDescription })}
                  multiline
                  hint="Séparez les paragraphes par une ligne vide."
                />
                <ImageUploader
                  folder="about"
                  label="Image"
                  aspect="portrait"
                  value={
                    site.aboutImageUrl
                      ? { url: site.aboutImageUrl, path: site.aboutImagePath }
                      : undefined
                  }
                  onChange={(value) =>
                    patch({
                      aboutImageUrl: value?.url ?? "",
                      ...(value?.path ? { aboutImagePath: value.path } : {}),
                    })
                  }
                />
              </>
            )}
          </div>
        </div>

        {status && <p className="mt-8 text-sm text-neutral-700">{status}</p>}
        {error && (
          <p className="mt-8 text-sm leading-relaxed text-red-600">{error}</p>
        )}

        <div className="mt-8 flex flex-col items-start gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="submit"
            disabled={saving}
            className="border border-black bg-black px-6 py-3 text-xs uppercase tracking-wide-xl text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <p className="text-xs text-neutral-500">
            Section active :{" "}
            {TABS.find((tab) => tab.id === activeTab)?.label}. Toutes les
            sections sont enregistrées ensemble.
          </p>
        </div>
      </form>
    </>
  );
}
