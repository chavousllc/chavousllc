"use client";

import { useFormContext } from "react-hook-form";
import { TextInput, TextArea, Select, Checkbox } from "@/components/form/inputs";
import { US_STATES } from "@/lib/us-states";
import type { ApplicationInput } from "@/lib/schemas";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">{children}</h3>;
}

export function StepExperience() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationInput>();

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-ink-900">Experience</h2>

      <div>
        <SectionTitle>License &amp; Experience</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="CDL Number" placeholder="D1234567" required error={errors.cdlNumber?.message} {...register("cdlNumber")} />
          <Select label="CDL State" required error={errors.cdlState?.message} {...register("cdlState")}>
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </Select>
          <TextInput label="CDL Class" placeholder="A" required error={errors.cdlClass?.message} {...register("cdlClass")} />
          <TextInput label="Endorsements (optional)" placeholder="Hazmat, Tanker…" error={errors.cdlEndorsements?.message} {...register("cdlEndorsements")} />
          <TextInput label="CDL Expiration" type="date" required error={errors.cdlExpiration?.message} {...register("cdlExpiration")} />
          <TextInput label="Years of Driving Experience" type="number" placeholder="5" required error={errors.yearsExperience?.message} {...register("yearsExperience", { valueAsNumber: true })} />
          <TextInput label="Equipment Operated" className="sm:col-span-2" placeholder="Dry van, reefer, flatbed…" required error={errors.equipmentOperated?.message} {...register("equipmentOperated")} />
        </div>
      </div>

      <div>
        <SectionTitle>Employment History (last 3 years)</SectionTitle>
        <div className="mt-4 space-y-6">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} className="rounded-xl border border-ink-100 p-5">
              <p className="text-xs font-semibold text-ink-400">Employer {i + 1}{i > 0 ? " (optional)" : ""}</p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Employer Name" placeholder="XYZ Trucking" {...register(`employmentHistory.${i}.employer`)} />
                <TextInput label="Position" placeholder="Company Driver" {...register(`employmentHistory.${i}.position`)} />
                <TextInput label="From" type="month" {...register(`employmentHistory.${i}.from`)} />
                <TextInput label="To" type="month" {...register(`employmentHistory.${i}.to`)} />
                <TextInput label="Reason for Leaving" placeholder="Better home time" className="sm:col-span-2" {...register(`employmentHistory.${i}.reasonForLeaving`)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Driving Record</SectionTitle>
        <div className="mt-4 space-y-5">
          <Checkbox label="I have been in a motor vehicle accident in the last 3 years" {...register("hadAccidents")} />
          <TextArea label="If yes, explain (optional)" error={errors.accidentsExplain?.message} {...register("accidentsExplain")} />
          <Checkbox label="I have had a moving violation in the last 3 years" {...register("hadViolations")} />
          <TextArea label="If yes, explain (optional)" error={errors.violationsExplain?.message} {...register("violationsExplain")} />
        </div>
      </div>

      <div>
        <SectionTitle>References</SectionTitle>
        <div className="mt-4 space-y-6">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} className="rounded-xl border border-ink-100 p-5">
              <p className="text-xs font-semibold text-ink-400">Reference {i + 1}{i > 0 ? " (optional)" : ""}</p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextInput label="Name" placeholder="Jane Doe" {...register(`references.${i}.name`)} />
                <TextInput label="Relationship" placeholder="Former Supervisor" {...register(`references.${i}.relationship`)} />
                <TextInput label="Phone" type="tel" placeholder="(555) 987-6543" {...register(`references.${i}.phone`)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
