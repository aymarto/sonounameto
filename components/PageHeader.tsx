type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="page-intro">
      <div className="container-page">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="section-title mt-2 max-w-3xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
