import Link from "next/link";
import { Container } from "@/components/Container";
import { SemiTruckIllustration } from "@/components/SemiTruckIllustration";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <Container className="section relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to move freight or join the fleet?
        </h2>
        <p className="max-w-2xl text-ink-300">
          Shippers get a rate back fast. Drivers get a straightforward
          application and a real callback — not a black hole.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/quote"
            className="btn-press rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Request a Quote
          </Link>
          <Link
            href="/apply"
            className="btn-press rounded-full border border-ink-600 px-6 py-3 text-sm font-semibold text-white hover:border-white"
          >
            Apply to Drive
          </Link>
        </div>

        <SemiTruckIllustration className="mt-10 h-auto w-full max-w-xl" />
      </Container>
    </section>
  );
}
