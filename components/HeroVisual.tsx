import { Truck, MapPin, ShieldCheck } from "lucide-react";

export function HeroVisual({
  fleetSize,
  foundingYear,
}: {
  fleetSize: number;
  foundingYear: number;
}) {
  const years = new Date().getFullYear() - foundingYear;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-ink-900 p-10 shadow-2xl shadow-brand-900/20">
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
        >
          <path
            d="M-20 320 C 100 260, 180 380, 300 300 S 480 220, 520 260"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="2 14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M-20 200 C 120 160, 160 260, 300 180 S 460 120, 520 160"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="2 10"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="relative flex aspect-square w-full flex-col items-center justify-center gap-6 sm:aspect-4/3">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm sm:h-36 sm:w-36">
            <Truck className="h-14 w-14 text-white sm:h-16 sm:w-16" strokeWidth={1.5} />
          </div>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
            Coast to Coast Freight
          </p>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-ink-100 sm:-left-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
          <Truck className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <p className="text-lg font-extrabold leading-none text-ink-900">
            {fleetSize}+
          </p>
          <p className="text-xs font-medium text-ink-500">Trucks in fleet</p>
        </div>
      </div>

      <div className="absolute -top-6 -right-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-ink-100 sm:-right-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
          <ShieldCheck className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <p className="text-lg font-extrabold leading-none text-ink-900">
            {years}+ yrs
          </p>
          <p className="text-xs font-medium text-ink-500">Safety track record</p>
        </div>
      </div>

      <div className="absolute -bottom-6 right-2 hidden items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-ink-100 sm:flex sm:right-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
          <MapPin className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <p className="text-lg font-extrabold leading-none text-ink-900">48</p>
          <p className="text-xs font-medium text-ink-500">States served</p>
        </div>
      </div>
    </div>
  );
}
