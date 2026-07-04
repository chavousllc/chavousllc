import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {label}
        </p>
        <Icon className="h-4 w-4 text-brand-600" />
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink-900">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-ink-500">{sublabel}</p>}
    </div>
  );
}
