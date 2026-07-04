"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, TextArea } from "@/components/form/inputs";
import { updateCompanyProfile } from "@/actions/admin-content";
import { ALL_STATE_ABBRS, FIPS_TO_STATE } from "@/lib/us-states";
import type { CompanyProfile } from "@/app/generated/prisma/client";

const STATE_OPTIONS = Object.values(FIPS_TO_STATE)
  .filter((s) => s.abbr !== "AK" && s.abbr !== "HI" && s.abbr !== "DC")
  .sort((a, b) => a.name.localeCompare(b.name));

type FormValues = Omit<CompanyProfile, "id" | "updatedAt">;

export function CompanyProfileForm({ profile }: { profile: CompanyProfile }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      companyName: profile.companyName,
      heroHeadline: profile.heroHeadline,
      heroSubtext: profile.heroSubtext,
      aboutText: profile.aboutText,
      foundingYear: profile.foundingYear,
      fleetSize: profile.fleetSize,
      dotNumber: profile.dotNumber,
      mcNumber: profile.mcNumber,
      phone: profile.phone,
      email: profile.email,
      dispatchHours: profile.dispatchHours,
      address: profile.address,
      coverageStates: profile.coverageStates,
    },
  });

  const coverageStates = watch("coverageStates");

  function toggleState(abbr: string) {
    const current = new Set(coverageStates);
    if (current.has(abbr)) current.delete(abbr);
    else current.add(abbr);
    setValue("coverageStates", Array.from(current));
  }

  async function onSubmit(data: FormValues) {
    setError(null);
    setSaved(false);
    const result = await updateCompanyProfile(data);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextInput label="Company Name" {...register("companyName")} />
        <TextInput label="Founding Year" type="number" {...register("foundingYear")} />
        <TextInput label="Fleet Size (trucks)" type="number" {...register("fleetSize")} />
        <TextInput label="DOT Number" {...register("dotNumber")} />
        <TextInput label="MC Number" {...register("mcNumber")} />
      </div>

      <TextInput label="Hero Headline" {...register("heroHeadline")} />
      <TextArea label="Hero Subtext" {...register("heroSubtext")} />
      <TextArea label="About Text" {...register("aboutText")} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextInput label="Phone" {...register("phone")} />
        <TextInput label="Email" type="email" {...register("email")} />
        <TextInput label="Dispatch Hours" {...register("dispatchHours")} />
        <TextInput label="Address" {...register("address")} />
      </div>

      <div>
        <span className="text-sm font-semibold text-ink-800">Coverage States</span>
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border border-ink-100 p-4 sm:grid-cols-6">
          {STATE_OPTIONS.map((s) => (
            <label key={s.abbr} className="flex items-center gap-1.5 text-xs text-ink-600">
              <input
                type="checkbox"
                checked={coverageStates?.includes(s.abbr) ?? false}
                onChange={() => toggleState(s.abbr)}
                className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              {s.abbr}
            </label>
          ))}
        </div>
        <div className="mt-2 flex gap-3 text-xs">
          <button
            type="button"
            className="font-semibold text-brand-600"
            onClick={() => setValue("coverageStates", ALL_STATE_ABBRS.filter((a) => a !== "AK" && a !== "HI" && a !== "DC"))}
          >
            Select all
          </button>
          <button type="button" className="font-semibold text-ink-400" onClick={() => setValue("coverageStates", [])}>
            Clear
          </button>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-brand-600">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
      </div>
    </form>
  );
}
