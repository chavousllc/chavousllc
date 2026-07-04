import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Driver Application | Chavous Transportation LLC",
  description: "Apply to drive for Chavous Transportation LLC — submit your CDL application online.",
};

export default function ApplyPage() {
  return (
    <section className="section bg-ink-50/60">
      <Container className="max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Careers
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Drive for Chavous Transportation
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-500">
            Fill out the application below. You&apos;ll receive a copy by
            email, and our hiring team will follow up directly.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-ink-100 bg-white p-8 shadow-sm sm:p-10">
          <ApplyForm />
        </div>
      </Container>
    </section>
  );
}
