import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateApplicationStatus } from "@/actions/admin-submissions";

export default async function ApplicationsPage() {
  const applications = await prisma.driverApplication.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Driver Applications</h1>
        <p className="mt-1 text-sm text-ink-500">{applications.length} total submissions</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/80 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Position</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-ink-50/40">
                <td className="px-5 py-4 font-semibold text-ink-800">{app.fullName}</td>
                <td className="px-5 py-4 text-ink-600">{app.positionAppliedFor}</td>
                <td className="px-5 py-4 text-ink-500">
                  <div>{app.email}</div>
                  <div className="text-xs">{app.phone}</div>
                </td>
                <td className="px-5 py-4 text-ink-500">
                  {app.submittedAt.toLocaleDateString("en-US")}
                </td>
                <td className="px-5 py-4">
                  <StatusSelect id={app.id} status={app.status} onUpdate={updateApplicationStatus} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink-400">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
