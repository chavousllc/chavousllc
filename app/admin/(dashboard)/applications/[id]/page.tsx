import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateApplicationStatus } from "@/actions/admin-submissions";

type EmploymentEntry = { employer?: string; position?: string; from?: string; to?: string; reasonForLeaving?: string };
type ReferenceEntry = { name?: string; relationship?: string; phone?: string };

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-800">{value || "—"}</dd>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await prisma.driverApplication.findUnique({ where: { id } });
  if (!app) notFound();

  const employmentHistory: EmploymentEntry[] = JSON.parse(app.employmentHistory || "[]");
  const references: ReferenceEntry[] = JSON.parse(app.references || "[]");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/applications" className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-800">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to applications
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-ink-900">{app.fullName}</h1>
          <p className="text-sm text-ink-500">
            Submitted {app.submittedAt.toLocaleString("en-US")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusSelect id={app.id} status={app.status} onUpdate={updateApplicationStatus} />
          <a
            href={`/api/admin/applications/${app.id}/pdf`}
            target="_blank"
            className="btn-press inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </a>
        </div>
      </div>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">Applicant</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoRow label="Email" value={app.email} />
          <InfoRow label="Phone" value={app.phone} />
          <InfoRow label="Date of Birth" value={app.dateOfBirth.toLocaleDateString("en-US")} />
          <InfoRow label="Address" value={`${app.address}, ${app.city}, ${app.state} ${app.zip}`} />
        </dl>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">Position</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoRow label="Applied For" value={app.positionAppliedFor} />
          <InfoRow label="Availability" value={app.availabilityDate.toLocaleDateString("en-US")} />
          <InfoRow label="Desired Routes" value={app.desiredRoutes} />
          <InfoRow label="Willing to Travel" value={app.willingToTravel ? "Yes" : "No"} />
          <InfoRow label="Eligible to Work" value={app.eligibleToWork ? "Yes" : "No"} />
        </dl>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">License &amp; Experience</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoRow label="CDL Number" value={app.cdlNumber} />
          <InfoRow label="CDL State" value={app.cdlState} />
          <InfoRow label="CDL Class" value={app.cdlClass} />
          <InfoRow label="Endorsements" value={app.cdlEndorsements} />
          <InfoRow label="CDL Expiration" value={app.cdlExpiration.toLocaleDateString("en-US")} />
          <InfoRow label="Years of Experience" value={app.yearsExperience} />
          <InfoRow label="Equipment Operated" value={app.equipmentOperated} />
        </dl>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">Employment History</h2>
        <div className="mt-4 space-y-4">
          {employmentHistory.filter((e) => e.employer).map((e, i) => (
            <div key={i} className="rounded-xl bg-ink-50/60 p-4 text-sm">
              <p className="font-semibold text-ink-800">{e.employer} — {e.position}</p>
              <p className="text-ink-500">{e.from} to {e.to}</p>
              {e.reasonForLeaving && <p className="mt-1 text-ink-500">Reason: {e.reasonForLeaving}</p>}
            </div>
          ))}
          {employmentHistory.filter((e) => e.employer).length === 0 && (
            <p className="text-sm text-ink-400">None provided.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">Driving Record</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="Accidents (last 3 yrs)" value={app.hadAccidents ? `Yes — ${app.accidentsExplain}` : "No"} />
          <InfoRow label="Violations (last 3 yrs)" value={app.hadViolations ? `Yes — ${app.violationsExplain}` : "No"} />
        </dl>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">References</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {references.filter((r) => r.name).map((r, i) => (
            <div key={i} className="rounded-xl bg-ink-50/60 p-4 text-sm">
              <p className="font-semibold text-ink-800">{r.name}</p>
              <p className="text-ink-500">{r.relationship}</p>
              <p className="text-ink-500">{r.phone}</p>
            </div>
          ))}
          {references.filter((r) => r.name).length === 0 && (
            <p className="text-sm text-ink-400">None provided.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-ink-900">Consent &amp; Signature</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoRow label="Background Check Consent" value={app.consentBackgroundCheck ? "Yes" : "No"} />
          <InfoRow label="Signature" value={app.signatureName} />
          <InfoRow label="Signed Date" value={app.signatureDate.toLocaleDateString("en-US")} />
        </dl>
      </section>
    </div>
  );
}
