"use client";

import { useFormContext } from "react-hook-form";
import { TextInput, Select, Checkbox } from "@/components/form/inputs";
import { US_STATES } from "@/lib/us-states";
import type { ApplicationInput } from "@/lib/schemas";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">{children}</h3>;
}

export function StepPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationInput>();

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-ink-900">Personal Information</h2>

      <div>
        <SectionTitle>Applicant Information</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Full Name" required error={errors.fullName?.message} {...register("fullName")} />
          <TextInput label="Email" type="email" required error={errors.email?.message} {...register("email")} />
          <TextInput label="Phone" type="tel" required error={errors.phone?.message} {...register("phone")} />
          <TextInput
            label="Social Security Number"
            placeholder="123-45-6789"
            required
            error={errors.ssn?.message}
            {...register("ssn")}
          />
          <TextInput label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
          <TextInput label="Street Address" className="sm:col-span-2" required error={errors.address?.message} {...register("address")} />
          <TextInput label="City" required error={errors.city?.message} {...register("city")} />
          <Select label="State" required error={errors.state?.message} {...register("state")}>
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </Select>
          <TextInput label="ZIP" required error={errors.zip?.message} {...register("zip")} />
        </div>
      </div>

      <div>
        <SectionTitle>Position</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Position Applied For" required error={errors.positionAppliedFor?.message} {...register("positionAppliedFor")} />
          <TextInput label="Availability Date" type="date" required error={errors.availabilityDate?.message} {...register("availabilityDate")} />
          <TextInput label="Desired Routes / Lanes" className="sm:col-span-2" required error={errors.desiredRoutes?.message} {...register("desiredRoutes")} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <Checkbox label="Willing to travel / run OTR" {...register("willingToTravel")} />
          <Checkbox label="Legally eligible to work in the U.S." {...register("eligibleToWork")} />
        </div>
      </div>
    </div>
  );
}
