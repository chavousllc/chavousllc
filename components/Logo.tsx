import clsx from "clsx";

/**
 * Placeholder brand mark: a geometric red cheetah head badge.
 * Swap this file for the real logo asset when it's available —
 * every consumer just imports <Logo /> from here.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={clsx("h-9 w-9", className)}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" className="fill-brand-600" />
      {/* ears */}
      <path d="M13 17 L18 8 L21 19 Z" className="fill-white" />
      <path d="M35 17 L30 8 L27 19 Z" className="fill-white" />
      {/* head */}
      <path
        d="M24 14c6.6 0 11 4.9 11 11.2 0 6.6-4.9 11.3-11 11.3S13 31.8 13 25.2C13 18.9 17.4 14 24 14z"
        className="fill-white"
      />
      {/* muzzle shading */}
      <path
        d="M24 26c3.4 0 6 2 6 5.4-1.7 1.3-3.8 2.1-6 2.1s-4.3-.8-6-2.1c0-3.4 2.6-5.4 6-5.4z"
        className="fill-brand-100"
      />
      {/* eyes */}
      <circle cx="19.2" cy="23.5" r="1.6" className="fill-brand-700" />
      <circle cx="28.8" cy="23.5" r="1.6" className="fill-brand-700" />
      {/* tear-line marks, a cheetah signature feature */}
      <path
        d="M19 24.8 L17.3 30"
        stroke="currentColor"
        className="stroke-brand-300"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M29 24.8 L30.7 30"
        stroke="currentColor"
        className="stroke-brand-300"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* nose */}
      <path d="M22.3 27.3 L25.7 27.3 L24 29.2 Z" className="fill-brand-700" />
      {/* spots */}
      <circle cx="15.5" cy="27" r="1" className="fill-brand-200" />
      <circle cx="32.5" cy="27" r="1" className="fill-brand-200" />
      <circle cx="16.5" cy="31.5" r="1" className="fill-brand-200" />
      <circle cx="31.5" cy="31.5" r="1" className="fill-brand-200" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showTagline = false,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-extrabold tracking-tight text-ink-900">
          Chavous <span className="text-brand-600">Transportation</span>
        </span>
        {showTagline && (
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Freight, moving at cheetah speed
          </span>
        )}
      </span>
    </span>
  );
}
