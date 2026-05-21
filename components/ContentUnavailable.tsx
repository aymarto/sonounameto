type Props = {
  className?: string;
  message?: string;
};

export default function ContentUnavailable({
  className = "",
  message = "Contenu pas disponible.",
}: Props) {
  return (
    <div className={`container-page py-16 text-center ${className}`.trim()}>
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
