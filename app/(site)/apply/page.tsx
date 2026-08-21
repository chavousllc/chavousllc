import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Driver Application | Chavous Transportation LLC",
  description: "Apply to drive for Chavous Transportation LLC — submit your CDL application online.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ resume?: string }>;
}) {
  const { resume } = await searchParams;

  return (
    <section className="section bg-ink-50/60">
      <Container className="max-w-4xl">
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

        <div className="mt-12">
          <ApplyForm resumeParam={resume} />
        </div>
      </Container>
    </section>
  );
}
