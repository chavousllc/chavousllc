"use client";

import { useFormContext } from "react-hook-form";
import { TextInput } from "@/components/form/inputs";
import type { ApplicationInput } from "@/lib/schemas";

export function StepBanking() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationInput>();

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">Banking (Direct Deposit)</h2>
      <p className="mt-2 text-sm text-ink-500">
        Used to set up direct deposit for pay once you&apos;re hired.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextInput label="Bank Name" placeholder="Chase Bank" className="sm:col-span-2" required error={errors.bankName?.message} {...register("bankName")} />
        <TextInput label="Routing Number" placeholder="9 digits" required error={errors.bankRoutingNumber?.message} {...register("bankRoutingNumber")} />
        <TextInput label="Account Number" placeholder="1234567890" required error={errors.bankAccountNumber?.message} {...register("bankAccountNumber")} />
      </div>
    </div>
  );
}
