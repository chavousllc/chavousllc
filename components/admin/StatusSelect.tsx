"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["NEW", "REVIEWED", "CONTACTED", "ARCHIVED"] as const;

export function StatusSelect({
  id,
  status,
  onUpdate,
}: {
  id: string;
  status: string;
  onUpdate: (id: string, status: (typeof STATUSES)[number]) => Promise<{ success: boolean }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as (typeof STATUSES)[number];
        startTransition(async () => {
          await onUpdate(id, next);
          router.refresh();
        });
      }}
      className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-700 outline-none focus:border-brand-500"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
