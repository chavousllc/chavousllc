import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Quote | Chavous Transportation LLC",
  description: "Submit a load booking request and get a freight quote from Chavous Transportation LLC.",
};

export default function QuotePage() {
  return (
    <section className="section bg-ink-50/60">
      <Container className="max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Load Booking Request
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Get a Freight Quote
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-500">
            Tell us about your shipment and our dispatch team will respond
            with rate and availability.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-ink-100 bg-white p-8 shadow-sm sm:p-10">
          <QuoteForm />
        </div>
      </Container>
    </section>
  );
}
