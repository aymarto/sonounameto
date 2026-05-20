export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/oeuvres", label: "Œuvres" },
  { href: "/projets", label: "Projets" },
  { href: "/evenements", label: "Expositions & Évènements" },
  { href: "/travail-brut", label: "Travail brut" },
  { href: "/references", label: "Références" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
