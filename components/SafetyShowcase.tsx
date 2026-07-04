import Link from "next/link";
import { ArrowRight, ShieldCheck, BadgeCheck, HandCoins, Zap } from "lucide-react";
import { Container } from "@/components/Container";
import { TrustVisual } from "@/components/TrustVisual";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Every driver and load runs under a DOT-compliant safety program, so your freight moves with confidence.",
    href: "/about",
  },
  {
    icon: BadgeCheck,
    title: "Fully Insured",
    description:
      "Full cargo and liability coverage on every shipment, with documentation ready whenever you need it.",
    href: "/about",
  },
  {
    icon: HandCoins,
    title: "Competitive Rates",
    description:
      "Straightforward pricing with no hidden fees, backed by a dispatch team that fights for your lane.",
    href: "/quote",
  },
  {
    icon: Zap,
    title: "Fast, Reliable Dispatch",
    description:
      "Real-time tracking and a dispatch team that actually answers the phone, every time.",
    href: "/#contact",
  },
];

export function SafetyShowcase() {
  return (
    <section className="section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">
            Top-rated, safety-first trucking
          </h2>
          <p className="mt-4 text-ink-500">
            Transportation safety affects everyone on the road. Here&apos;s
            how we keep your freight — and everyone around it — safe.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <TrustVisual />
        </div>
      </Container>
    </section>
  );
}
