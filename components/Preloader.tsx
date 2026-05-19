"use client";

type Props = {
  visible: boolean;
};

export default function Preloader({ visible }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-hidden={!visible}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-white transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <p className="font-display text-2xl tracking-wide-xl uppercase md:text-3xl">
        SONOUNAMETO
      </p>
      <div className="mt-8 h-px w-12 animate-pulse bg-white/40" />
      <p className="mt-6 text-[10px] uppercase tracking-wide-xl text-white/50">
        Chargement
      </p>
    </div>
  );
}
