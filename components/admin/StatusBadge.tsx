import clsx from "clsx";

const STYLES: Record<string, string> = {
  NEW: "bg-brand-50 text-brand-700",
  REVIEWED: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-ink-100 text-ink-500",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STYLES[status] ?? "bg-ink-100 text-ink-500"
      )}
    >
      {status}
    </span>
  );
}
