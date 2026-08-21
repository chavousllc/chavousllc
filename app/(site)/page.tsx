import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { HeroVisual } from "@/components/HeroVisual";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { TrustedByStrip } from "@/components/TrustedByStrip";
import { SafetyShowcase } from "@/components/SafetyShowcase";
import { ContactSection } from "@/components/ContactSection";
import { getCompanyProfile, getServices } from "@/lib/content";

export default async function HomePage() {
  const [profile, services] = await Promise.all([
    getCompanyProfile(),
    getServices(),
  ]);

  return (
    <>
      <section id="home" className="overflow-hidden bg-ink-50/60 scroll-mt-24">
        <Container className="grid grid-cols-1 items-center gap-16 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Serving all 48 continental states
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              {profile.heroHeadline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
              {profile.heroSubtext}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/quote"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-700"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/apply"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-ink-200 px-6 py-3.5 text-sm font-semibold text-ink-800 transition-colors hover:border-brand-600 hover:text-brand-600"
              >
                Apply to Drive
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md pt-6 lg:pt-0">
            <HeroVisual
              fleetSize={profile.fleetSize}
              foundingYear={profile.foundingYear}
            />
          </div>
        </Container>
      </section>

      <TrustedByStrip />

      <SafetyShowcase />

      <section id="services" className="section scroll-mt-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">
              Freight solutions built around your lane
            </h2>
            <p className="mt-4 text-ink-500">
              From standard dry van to time-critical expedited runs, our
              dispatch team matches every load with the right equipment.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />

      <ContactSection profile={profile} />
    </>
  );
}
