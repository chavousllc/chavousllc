"use client";

import { useFormContext } from "react-hook-form";
import { TextInput, Checkbox } from "@/components/form/inputs";
import type { ApplicationInput } from "@/lib/schemas";

export function StepSubmit({ serverError }: { serverError: string | null }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationInput>();

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">Consent &amp; Signature</h2>
      <p className="mt-4 text-sm leading-relaxed text-ink-500">
        I certify that the information provided in this application is true and complete to the best of my
        knowledge. I authorize Chavous Transportation LLC to verify my driving record and employment history, and
        to conduct a background and motor vehicle report (MVR) check as permitted by the Fair Credit Reporting Act
        and applicable FMCSA regulations.
      </p>
      <Checkbox
        className="mt-4"
        label="I have read and agree to the statement above"
        required
        error={errors.consentBackgroundCheck?.message}
        {...register("consentBackgroundCheck")}
      />
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextInput label="Signature (type full name)" placeholder="John Smith" required error={errors.signatureName?.message} {...register("signatureName")} />
        <TextInput label="Date" type="date" required error={errors.signatureDate?.message} {...register("signatureDate")} />
      </div>
      {serverError && <p className="mt-5 text-sm font-medium text-brand-600">{serverError}</p>}
    </div>
  );
}
