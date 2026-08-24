import type { Metadata } from "next";
import { ShieldCheck, Truck, CalendarDays, Award } from "lucide-react";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { Reveal } from "@/components/Reveal";
import { getCompanyProfile } from "@/lib/content";
import { saferDotHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "About Us | Chavous Transportation LLC",
  description:
    "Learn about Chavous Transportation LLC's fleet, history, and safety-first approach to freight trucking.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const profile = await getCompanyProfile();
  const years = new Date().getFullYear() - profile.foundingYear;

  const stats = [
    { label: "Trucks in fleet", value: `${profile.fleetSize}+`, icon: Truck },
    { label: "Years in business", value: `${years}+`, icon: CalendarDays },
    { label: "States covered", value: "48", icon: ShieldCheck },
    { label: "FMCSA compliant", value: "100%", icon: Award },
  ];

  return (
    <>
      <section className="section bg-ink-50/60">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            About Us
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Built on reliability, safety, and communication
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-500">
            {profile.aboutText}
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="rounded-2xl border border-ink-100 p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/5">
                  <stat.icon className="mx-auto h-6 w-6 text-brand-600" />
                  <p className="mt-3 text-2xl font-extrabold text-ink-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-500">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-ink-50/60">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-bold text-ink-900">Our Story</h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              Founded in {profile.foundingYear}, {profile.companyName} started
              with a simple goal: move freight the right way, every time.
              What began as a small operation has grown into a mid-size
              carrier serving shippers across the continental United States,
              without losing the personal attention that got us here.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Today our team of experienced drivers, dispatchers, and safety
              staff work together to keep freight moving — with clear
              communication at every step, from pickup to delivery.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-2xl font-bold text-ink-900">Safety Focus</h2>
            <ul className="mt-4 space-y-4">
              {[
                "Ongoing driver safety training and certification programs",
                "Regularly inspected and maintained modern fleet equipment",
                "Full compliance with FMCSA hours-of-service regulations",
                "Fully licensed and insured on every load, every lane",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                  <span className="text-sm leading-relaxed text-ink-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-medium text-ink-400">
              <a
                href={saferDotHref(profile.dotNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-600"
              >
                {profile.dotNumber}
              </a>{" "}
              &middot; {profile.mcNumber}
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
