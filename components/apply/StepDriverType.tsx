"use client";

import { useFormContext } from "react-hook-form";
import { User, Truck, Wrench } from "lucide-react";
import clsx from "clsx";
import { DRIVER_TYPES, type ApplicationInput } from "@/lib/schemas";

const ICONS = { COMPANY_DRIVER: User, OWNER_OPERATOR: Truck, LEASED_OPERATOR: Wrench } as const;
const STYLES = {
  COMPANY_DRIVER: "bg-blue-50 text-blue-600",
  OWNER_OPERATOR: "bg-green-50 text-green-600",
  LEASED_OPERATOR: "bg-purple-50 text-purple-600",
} as const;

export function StepDriverType() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ApplicationInput>();
  const selected = watch("driverType");

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">Select Your Driver Type</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {DRIVER_TYPES.map((type) => {
          const Icon = ICONS[type.value];
          const isSelected = selected === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setValue("driverType", type.value, { shouldValidate: true, shouldDirty: true })}
              className={clsx(
                "flex flex-col items-center rounded-2xl border p-6 text-center transition-colors",
                isSelected ? "border-brand-500 ring-2 ring-brand-100" : "border-ink-100 hover:border-ink-200"
              )}
            >
              <span className={clsx("flex h-14 w-14 items-center justify-center rounded-full", STYLES[type.value])}>
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-base font-bold text-ink-900">{type.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{type.description}</p>
            </button>
          );
        })}
      </div>
      {errors.driverType && <p className="mt-4 text-sm font-medium text-brand-600">{errors.driverType.message}</p>}
    </div>
  );
}
