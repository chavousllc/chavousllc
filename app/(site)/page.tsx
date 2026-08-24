import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, MapPin } from "lucide-react";
import { Container } from "@/components/Container";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { TrustedByStrip } from "@/components/TrustedByStrip";
import { SafetyShowcase } from "@/components/SafetyShowcase";
import { ContactSection } from "@/components/ContactSection";
import { getCompanyProfile, getServices } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const [profile, services] = await Promise.all([
    getCompanyProfile(),
    getServices(),
  ]);

  const yearsInBusiness = new Date().getFullYear() - profile.foundingYear;

  const heroStats = [
    { icon: Truck, value: `${profile.fleetSize}+`, label: "Trucks in fleet" },
    { icon: ShieldCheck, value: `${yearsInBusiness}+ yrs`, label: "Safety track record" },
    { icon: MapPin, value: "48", label: "States served" },
  ];

  return (
    <>
      <section id="home" className="relative isolate overflow-hidden bg-ink-900 scroll-mt-24">
        <Image
          src="/hero-truck.jpg"
          alt="Chavous Transportation tractor-trailer on the highway"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/88 via-ink-900/70 to-ink-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/8 to-transparent" />

        <Container className="relative py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm ring-1 ring-white/20">
              Serving all 48 continental states
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {profile.heroHeadline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
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
                className="btn-press inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white"
              >
                Apply to Drive
              </Link>
            </div>
          </div>

          <div className="mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm ring-1 ring-white/20"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-extrabold leading-none text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-ink-200">{stat.label}</p>
                </div>
              </div>
            ))}
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
