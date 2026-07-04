import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateQuoteStatus } from "@/actions/admin-submissions";

export default async function QuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Quote Requests</h1>
        <p className="mt-1 text-sm text-ink-500">{quotes.length} total submissions</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50/80 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3">Shipper</th>
              <th className="px-5 py-3">Lane</th>
              <th className="px-5 py-3">Equipment</th>
              <th className="px-5 py-3">Pickup</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-ink-50/40">
                <td className="px-5 py-4 font-semibold text-ink-800">{q.shipperCompany}</td>
                <td className="px-5 py-4 text-ink-600">
                  {q.originCity}, {q.originState} → {q.destCity}, {q.destState}
                </td>
                <td className="px-5 py-4 text-ink-600">
                  {q.equipmentType} · {q.loadType} · {q.weight} lbs
                </td>
                <td className="px-5 py-4 text-ink-500">{q.pickupDate.toLocaleDateString("en-US")}</td>
                <td className="px-5 py-4 text-ink-500">
                  <div>{q.contactName}</div>
                  <div className="text-xs">{q.email} · {q.phone}</div>
                </td>
                <td className="px-5 py-4">
                  <StatusSelect id={q.id} status={q.status} onUpdate={updateQuoteStatus} />
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink-400">
                  No quote requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
