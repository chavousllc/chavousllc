"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { upsertService, deleteService } from "@/actions/admin-content";
import type { Service } from "@prisma/client";

const ICON_OPTIONS = [
  "truck",
  "boxes",
  "layers",
  "zap",
  "route",
  "package",
  "radar",
] as const;
const CATEGORY_OPTIONS = [
  "DRY_VAN",
  "FTL",
  "PARTIAL_TRUCKLOAD",
  "LTL",
  "EXPEDITED",
  "DEDICATED_LANES",
  "DISPATCH_TRACKING",
] as const;

export type ServiceDraft = Omit<Service, "createdAt" | "updatedAt" | "icon"> & {
  icon: (typeof ICON_OPTIONS)[number];
};
type Draft = ServiceDraft;

function ServiceRow({ service, onDeleted }: { service: Draft; onDeleted: (id: string) => void }) {
  const [draft, setDraft] = useState(service);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const result = await upsertService(draft);
    if (result.success && !draft.id) setDraft((d) => ({ ...d, id: result.id }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!draft.id) return;
    await deleteService(draft.id);
    onDeleted(draft.id);
  }

  return (
    <div className="rounded-xl border border-ink-100 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Title</span>
          <input
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Category</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value as Draft["category"] })}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c.replace("_", " ")}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Description</span>
        <textarea
          rows={2}
          className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Icon</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value as Draft["icon"] })}
          >
            {ICON_OPTIONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Sort Order</span>
          <input
            type="number"
            className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            value={draft.sortOrder}
            onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
          />
        </label>
        <label className="flex items-center gap-2 self-end pb-2.5">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            className="h-4 w-4 rounded border-ink-300 text-brand-600"
          />
          <span className="text-xs font-semibold text-ink-600">Featured on home</span>
        </label>
        <div className="flex items-end justify-end gap-2 pb-1">
          {saved && <span className="text-xs font-medium text-emerald-600">Saved</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            Save
          </button>
          {draft.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-500 hover:border-brand-600 hover:text-brand-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServicesManager({ services }: { services: Draft[] }) {
  const [list, setList] = useState(services);

  function addService() {
    setList([
      ...list,
      {
        id: "",
        title: "New Service",
        description: "Describe this service.",
        icon: "truck",
        category: "DRY_VAN",
        featured: false,
        sortOrder: list.length,
      },
    ]);
  }

  function handleDeleted(id: string) {
    setList((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-5">
      {list.map((s, i) => (
        <ServiceRow key={s.id || `new-${i}`} service={s} onDeleted={handleDeleted} />
      ))}
      <button
        type="button"
        onClick={addService}
        className="flex items-center gap-2 rounded-full border border-dashed border-ink-300 px-4 py-2.5 text-sm font-semibold text-ink-500 hover:border-brand-600 hover:text-brand-600"
      >
        <Plus className="h-4 w-4" /> Add Service
      </button>
    </div>
  );
}
