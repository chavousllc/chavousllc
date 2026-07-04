import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CoverageMap } from "@/components/CoverageMap";
import { CTASection } from "@/components/CTASection";
import { getCompanyProfile } from "@/lib/content";
import { FIPS_TO_STATE } from "@/lib/us-states";

export const metadata: Metadata = {
  title: "Coverage Area | Chavous Transportation LLC",
  description:
    "See the states and regions Chavous Transportation LLC serves across the continental United States.",
};

export default async function CoveragePage() {
  const profile = await getCompanyProfile();
  const coveredNames = Object.values(FIPS_TO_STATE)
    .filter((s) => profile.coverageStates.includes(s.abbr))
    .map((s) => s.name)
    .sort();

  return (
    <>
      <section className="section bg-ink-50/60">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Coverage Area
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Freight lanes across the continental U.S.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-500">
            We run {coveredNames.length} states nationwide. Hover the map to
            check your lane, or request a quote and our dispatch team will
            confirm capacity.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CoverageMap coverageStates={profile.coverageStates} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink-900">
              States we serve
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-600">
              {coveredNames.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
