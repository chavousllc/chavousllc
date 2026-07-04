import Link from "next/link";
import { Eye, Truck, FileText, Mail } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageViewsChart } from "@/components/admin/PageViewsChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  getDashboardCounts,
  getPageViewsByDay,
  getTopPages,
  getRecentSubmissions,
} from "@/lib/analytics";

export default async function AdminOverviewPage() {
  const [counts, pageViews, topPages, recent] = await Promise.all([
    getDashboardCounts(),
    getPageViewsByDay(30),
    getTopPages(30),
    getRecentSubmissions(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Overview</h1>
        <p className="mt-1 text-sm text-ink-500">
          Last 30 days of site activity and submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Page Views" value={counts.totalViews} icon={Eye} sublabel="All time" />
        <StatCard
          label="Driver Applications"
          value={counts.totalApplications}
          icon={Truck}
          sublabel={`${counts.newApplications} new`}
        />
        <StatCard
          label="Quote Requests"
          value={counts.totalQuotes}
          icon={FileText}
          sublabel={`${counts.newQuotes} new`}
        />
        <StatCard
          label="Messages"
          value={counts.totalMessages}
          icon={Mail}
          sublabel={`${counts.newMessages} new`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-ink-900">Page Views (30 days)</h2>
          <div className="mt-4">
            <PageViewsChart data={pageViews} />
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-ink-900">Top Pages</h2>
          <div className="mt-4 space-y-3">
            {topPages.length === 0 && (
              <p className="text-sm text-ink-400">No data yet.</p>
            )}
            {topPages.map((p) => {
              const max = topPages[0]?.count || 1;
              return (
                <div key={p.path}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-ink-700">{p.path}</span>
                    <span className="text-ink-400">{p.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-ink-100">
                    <div
                      className="h-1.5 rounded-full bg-brand-600"
                      style={{ width: `${Math.max(6, (p.count / max) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Recent Applications</h2>
            <Link href="/admin/applications" className="text-xs font-semibold text-brand-600">View all</Link>
          </div>
          <ul className="mt-4 space-y-4">
            {recent.applications.length === 0 && <p className="text-sm text-ink-400">None yet.</p>}
            {recent.applications.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-800">{a.fullName}</p>
                  <p className="truncate text-xs text-ink-400">{a.positionAppliedFor}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Recent Quotes</h2>
            <Link href="/admin/quotes" className="text-xs font-semibold text-brand-600">View all</Link>
          </div>
          <ul className="mt-4 space-y-4">
            {recent.quotes.length === 0 && <p className="text-sm text-ink-400">None yet.</p>}
            {recent.quotes.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-800">{q.shipperCompany}</p>
                  <p className="truncate text-xs text-ink-400">
                    {q.originCity}, {q.originState} → {q.destCity}, {q.destState}
                  </p>
                </div>
                <StatusBadge status={q.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs font-semibold text-brand-600">View all</Link>
          </div>
          <ul className="mt-4 space-y-4">
            {recent.messages.length === 0 && <p className="text-sm text-ink-400">None yet.</p>}
            {recent.messages.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-800">{m.name}</p>
                  <p className="truncate text-xs text-ink-400">{m.message}</p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
