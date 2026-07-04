const PLACEHOLDER_PARTNERS = [
  "Northpoint Retail",
  "Cascade Foods Co.",
  "Meridian Manufacturing",
  "Ironclad Supply",
  "BlueHarbor Distribution",
  "Summit Building Materials",
];

export function TrustedByStrip() {
  return (
    <section className="border-y border-ink-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink-400">
          Trusted by shippers across the country
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {PLACEHOLDER_PARTNERS.map((name) => (
            <span
              key={name}
              className="text-lg font-extrabold uppercase tracking-tight text-ink-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
