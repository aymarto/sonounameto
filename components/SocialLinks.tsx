import { SOCIAL_LINKS } from "@/lib/social";

type Variant = "footer" | "page";

const linkClass: Record<Variant, string> = {
  footer:
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10",
  page: "inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/15 text-ink transition-colors hover:border-black hover:bg-black/5",
};

const iconClass: Record<Variant, string> = {
  footer: "h-5 w-5",
  page: "h-5 w-5",
};

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 8.5h2.5V5h-2.2c-2.5 0-4.1 1.5-4.1 4.3V12H8v3.5h2.2V24h3.7v-8.5H18l.5-3.5h-3.1v-2.2c0-1 .3-1.8 1.9-1.8z" />
    </svg>
  );
}

function IconPortfolio({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M8 4h8l2 4v12H6V8l2-4z" />
      <path d="M8 4v4h8V4M10 13h4M10 16h4" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

type Props = {
  variant?: Variant;
  className?: string;
};

export default function SocialLinks({
  variant = "page",
  className = "",
}: Props) {
  const items = [
    {
      href: SOCIAL_LINKS.instagram,
      label: "Instagram",
      icon: IconInstagram,
      external: true,
    },
    {
      href: SOCIAL_LINKS.facebook,
      label: "Facebook",
      icon: IconFacebook,
      external: true,
    },
    {
      href: `mailto:${SOCIAL_LINKS.email}`,
      label: SOCIAL_LINKS.email,
      icon: IconMail,
      external: false,
    },
    {
      href: SOCIAL_LINKS.portfolio,
      label: "Portfolio",
      icon: IconPortfolio,
      external: true,
    },
  ] as const;

  return (
    <ul
      className={`flex flex-wrap items-center gap-3 ${className}`}
      aria-label="Réseaux sociaux, portfolio et contact"
    >
      {items.map(({ href, label, icon: Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={linkClass[variant]}
            aria-label={label}
            title={label}
          >
            <Icon className={iconClass[variant]} />
          </a>
        </li>
      ))}
    </ul>
  );
}
