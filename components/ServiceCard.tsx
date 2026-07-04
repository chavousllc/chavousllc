import { ICONS } from "@/lib/icons";
import type { Service } from "@/app/generated/prisma/client";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? ICONS.truck;

  return (
    <div className="group rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink-900">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        {service.description}
      </p>
    </div>
  );
}
