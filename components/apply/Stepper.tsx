"use client";

import { Truck, User, FileText, Upload, CreditCard, Check } from "lucide-react";
import clsx from "clsx";

const STEPS = [
  { label: "Driver Type", icon: Truck },
  { label: "Personal Info", icon: User },
  { label: "Experience", icon: FileText },
  { label: "Documents", icon: Upload },
  { label: "Banking", icon: CreditCard },
  { label: "Submit", icon: Check },
] as const;

export function Stepper({ step, onStepClick }: { step: number; onStepClick?: (step: number) => void }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
      <ol className="flex items-start justify-between">
        {STEPS.map((s, i) => {
          const state = i < step ? "complete" : i === step ? "active" : "upcoming";
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!onStepClick || i > step}
                onClick={() => onStepClick?.(i)}
                className="flex flex-col items-center gap-2 disabled:cursor-default"
              >
                <span
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                    state === "active" && "bg-brand-600 text-white",
                    state === "complete" && "bg-brand-100 text-brand-600",
                    state === "upcoming" && "bg-ink-100 text-ink-400"
                  )}
                >
                  {state === "complete" ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <span
                  className={clsx(
                    "text-xs font-semibold",
                    state === "active" ? "text-brand-600" : state === "complete" ? "text-ink-700" : "text-ink-400"
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span className={clsx("mx-2 mt-[-20px] h-px flex-1", i < step ? "bg-brand-300" : "bg-ink-100")} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
