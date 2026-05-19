type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="border-b border-black/10 bg-white py-16 md:py-24">
      <div className="container-page">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="section-title mt-3 max-w-3xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
