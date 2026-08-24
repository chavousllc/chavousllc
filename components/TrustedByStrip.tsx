import {
  ShoppingBag,
  Apple,
  Factory,
  ShieldCheck,
  Anchor,
  Mountain,
  Store,
  Wheat,
  type LucideIcon,
} from "lucide-react";

const PARTNERS: { name: string; icon: LucideIcon }[] = [
  { name: "Northpoint Retail", icon: ShoppingBag },
  { name: "Cascade Foods Co.", icon: Apple },
  { name: "Meridian Manufacturing", icon: Factory },
  { name: "Ironclad Supply", icon: ShieldCheck },
  { name: "BlueHarbor Distribution", icon: Anchor },
  { name: "Summit Building Materials", icon: Mountain },
  { name: "Vantage Retail Group", icon: Store },
  { name: "Pinnacle Foods", icon: Wheat },
];

function PartnerLogo({ name, icon: Icon }: { name: string; icon: LucideIcon }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-6">
      <Icon className="h-5 w-5 text-ink-300" strokeWidth={1.75} />
      <span className="whitespace-nowrap text-lg font-extrabold uppercase tracking-tight text-ink-300">
        {name}
      </span>
    </div>
  );
}

export function TrustedByStrip() {
  return (
    <section className="border-y border-ink-100 bg-white py-10">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink-400">
          Trusted by shippers across the country
        </p>

        <div className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-ltr flex w-max items-center group-hover:[animation-play-state:paused]">
            {PARTNERS.map((partner) => (
              <PartnerLogo key={`a-${partner.name}`} {...partner} />
            ))}
            {PARTNERS.map((partner) => (
              <PartnerLogo key={`b-${partner.name}`} {...partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
