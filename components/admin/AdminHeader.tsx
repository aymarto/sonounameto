import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
};

export default function AdminHeader({
  eyebrow,
  title,
  description,
  action,
}: Props) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-black/10 pb-6">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-3xl md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="border border-black bg-black px-5 py-3 text-xs uppercase tracking-wide-xl text-white transition-colors hover:bg-neutral-800"
        >
          {action.label}
        </Link>
      )}
    </header>
  );
}
