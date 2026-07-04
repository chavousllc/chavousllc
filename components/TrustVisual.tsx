import { ShieldCheck } from "lucide-react";

export function TrustVisual() {
  return (
    <div className="relative h-full min-h-[420px]">
      <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 p-10 shadow-2xl shadow-ink-900/20">
        <svg
          className="absolute inset-0 h-full w-full opacity-10"
          viewBox="0 0 400 500"
          preserveAspectRatio="none"
        >
          <circle cx="200" cy="180" r="220" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="200" cy="180" r="160" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="200" cy="180" r="100" stroke="white" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <ShieldCheck className="h-14 w-14 text-brand-400" strokeWidth={1.5} />
        </div>
        <p className="relative mt-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
          Safety-First Fleet
        </p>
      </div>

      <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-ink-100 sm:-left-8">
        <p className="text-sm font-bold text-ink-900">Fully Insured &amp; Compliant</p>
      </div>
      <div className="absolute -top-6 -right-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-ink-100 sm:-right-8">
        <p className="text-sm font-bold text-ink-900">FMCSA Compliant</p>
      </div>
    </div>
  );
}
