"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { TextInput, TextArea, Select } from "@/components/form/inputs";
import { quoteSchema, type QuoteInput, EQUIPMENT_TYPES, LOAD_TYPES } from "@/lib/schemas";
import { US_STATES } from "@/lib/us-states";
import { submitQuoteRequest } from "@/actions/quote";

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { equipmentType: "DRY_VAN", loadType: "FTL" },
  });

  async function onSubmit(data: QuoteInput) {
    setServerError(null);
    try {
      const result = await submitQuoteRequest(data);
      if (result.success) {
        setSubmitted(true);
        reset();
      } else {
        setServerError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50/60 p-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-600" />
        <p className="text-xl font-bold text-ink-900">Quote request received</p>
        <p className="max-w-sm text-sm text-ink-500">
          Our dispatch team will follow up shortly with rate and availability
          for your lane.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">
          Shipper Information
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Company Name" required error={errors.shipperCompany?.message} {...register("shipperCompany")} />
          <TextInput label="Contact Name" required error={errors.contactName?.message} {...register("contactName")} />
          <TextInput label="Email" type="email" required error={errors.email?.message} {...register("email")} />
          <TextInput label="Phone" type="tel" required error={errors.phone?.message} {...register("phone")} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">
          Load Details
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Origin City" required error={errors.originCity?.message} {...register("originCity")} />
          <Select label="Origin State" required error={errors.originState?.message} {...register("originState")}>
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </Select>
          <TextInput label="Destination City" required error={errors.destCity?.message} {...register("destCity")} />
          <Select label="Destination State" required error={errors.destState?.message} {...register("destState")}>
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </Select>
          <TextInput label="Pickup Date" type="date" required error={errors.pickupDate?.message} {...register("pickupDate")} />
          <TextInput label="Weight (lbs)" type="number" required error={errors.weight?.message} {...register("weight", { valueAsNumber: true })} />
          <Select label="Equipment Type" required error={errors.equipmentType?.message} {...register("equipmentType")}>
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
          <Select label="Load Type" required error={errors.loadType?.message} {...register("loadType")}>
            {LOAD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <TextInput label="Commodity" className="mt-5" required error={errors.commodity?.message} {...register("commodity")} />
        <TextArea label="Additional Notes (optional)" className="mt-5" error={errors.notes?.message} {...register("notes")} />
      </div>

      {serverError && <p className="text-sm font-medium text-brand-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-press w-full rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Request a Quote"}
      </button>
    </form>
  );
}
