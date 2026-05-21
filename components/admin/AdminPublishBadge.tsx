import { publishLabel } from "@/lib/publish";

type Props = {
  published?: boolean;
  className?: string;
};

export default function AdminPublishBadge({ published, className = "" }: Props) {
  const visible = published !== false;
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wide-xl ${
        visible
          ? "bg-emerald-100 text-emerald-800"
          : "bg-neutral-200 text-neutral-600"
      } ${className}`.trim()}
    >
      {publishLabel(published)}
    </span>
  );
}
