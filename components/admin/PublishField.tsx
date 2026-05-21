type Props = {
  published: boolean;
  onChange: (published: boolean) => void;
  id?: string;
};

export default function PublishField({ published, onChange, id = "published" }: Props) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 border border-black/10 bg-neutral-50 px-4 py-3"
    >
      <input
        id={id}
        type="checkbox"
        checked={published}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-black"
      />
      <span className="text-sm">
        <span className="font-medium">Publier sur le site</span>
        <span className="mt-0.5 block text-xs text-neutral-500">
          Décochez pour masquer sans supprimer.
        </span>
      </span>
    </label>
  );
}
