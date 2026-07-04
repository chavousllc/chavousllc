"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { TextInput, TextArea, Checkbox } from "@/components/form/inputs";
import { applicationSchema, type ApplicationInput } from "@/lib/schemas";
import { submitDriverApplication } from "@/actions/apply";

const defaultValues: ApplicationInput = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dateOfBirth: "",
  positionAppliedFor: "Company Driver",
  availabilityDate: "",
  desiredRoutes: "",
  willingToTravel: true,
  eligibleToWork: true,
  cdlNumber: "",
  cdlState: "",
  cdlClass: "",
  cdlEndorsements: "",
  cdlExpiration: "",
  yearsExperience: 0,
  equipmentOperated: "",
  employmentHistory: [
    { employer: "", position: "", from: "", to: "", reasonForLeaving: "" },
    { employer: "", position: "", from: "", to: "", reasonForLeaving: "" },
    { employer: "", position: "", from: "", to: "", reasonForLeaving: "" },
  ],
  hadAccidents: false,
  accidentsExplain: "",
  hadViolations: false,
  violationsExplain: "",
  references: [
    { name: "", relationship: "", phone: "" },
    { name: "", relationship: "", phone: "" },
    { name: "", relationship: "", phone: "" },
  ],
  consentBackgroundCheck: false,
  signatureName: "",
  signatureDate: "",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">
      {children}
    </h3>
  );
}

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });

  async function onSubmit(data: ApplicationInput) {
    setServerError(null);
    const result = await submitDriverApplication(data);
    if (result.success) {
      setSubmitted(true);
      reset(defaultValues);
    } else {
      setServerError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50/60 p-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-600" />
        <p className="text-xl font-bold text-ink-900">Application submitted</p>
        <p className="max-w-sm text-sm text-ink-500">
          Thanks for applying to drive with us. A copy of your application
          was emailed to you, and our hiring team will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div>
        <SectionTitle>Applicant Information</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
          <TextInput label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <TextInput label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
          <TextInput label="Date of Birth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
          <TextInput label="Street Address" className="sm:col-span-2" error={errors.address?.message} {...register("address")} />
          <TextInput label="City" error={errors.city?.message} {...register("city")} />
          <TextInput label="State" placeholder="TX" maxLength={2} error={errors.state?.message} {...register("state")} />
          <TextInput label="ZIP" error={errors.zip?.message} {...register("zip")} />
        </div>
      </div>

      <div>
        <SectionTitle>Position</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Position Applied For" error={errors.positionAppliedFor?.message} {...register("positionAppliedFor")} />
          <TextInput label="Availability Date" type="date" error={errors.availabilityDate?.message} {...register("availabilityDate")} />
          <TextInput label="Desired Routes / Lanes" className="sm:col-span-2" error={errors.desiredRoutes?.message} {...register("desiredRoutes")} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <Checkbox label="Willing to travel / run OTR" {...register("willingToTravel")} />
          <Checkbox label="Legally eligible to work in the U.S." {...register("eligibleToWork")} />
        </div>
      </div>

      <div>
        <SectionTitle>License &amp; Experience</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="CDL Number" error={errors.cdlNumber?.message} {...register("cdlNumber")} />
          <TextInput label="CDL State" placeholder="TX" maxLength={2} error={errors.cdlState?.message} {...register("cdlState")} />
          <TextInput label="CDL Class" placeholder="A" error={errors.cdlClass?.message} {...register("cdlClass")} />
          <TextInput label="Endorsements (optional)" placeholder="Hazmat, Tanker…" error={errors.cdlEndorsements?.message} {...register("cdlEndorsements")} />
          <TextInput label="CDL Expiration" type="date" error={errors.cdlExpiration?.message} {...register("cdlExpiration")} />
          <TextInput label="Years of Driving Experience" type="number" error={errors.yearsExperience?.message} {...register("yearsExperience", { valueAsNumber: true })} />
          <TextInput label="Equipment Operated" className="sm:col-span-2" placeholder="Dry van, reefer, flatbed…" error={errors.equipmentOperated?.message} {...register("equipmentOperated")} />
        </div>
      </div>

      <div>
        <SectionTitle>Employment History (last 3 years)</SectionTitle>
        <div className="mt-4 space-y-6">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} className="rounded-xl border border-ink-100 p-5">
              <p className="text-xs font-semibold text-ink-400">Employer {i + 1}{i > 0 ? " (optional)" : ""}</p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Employer Name" {...register(`employmentHistory.${i}.employer`)} />
                <TextInput label="Position" {...register(`employmentHistory.${i}.position`)} />
                <TextInput label="From" type="month" {...register(`employmentHistory.${i}.from`)} />
                <TextInput label="To" type="month" {...register(`employmentHistory.${i}.to`)} />
                <TextInput label="Reason for Leaving" className="sm:col-span-2" {...register(`employmentHistory.${i}.reasonForLeaving`)} />
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
                <TextInput label="Name" {...register(`references.${i}.name`)} />
                <TextInput label="Relationship" {...register(`references.${i}.relationship`)} />
                <TextInput label="Phone" type="tel" {...register(`references.${i}.phone`)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Consent &amp; Signature</SectionTitle>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          I certify that the information provided in this application is
          true and complete to the best of my knowledge. I authorize Chavous
          Transportation LLC to verify my driving record and employment
          history, and to conduct a background and motor vehicle report
          (MVR) check as permitted by the Fair Credit Reporting Act and
          applicable FMCSA regulations.
        </p>
        <Checkbox
          className="mt-4"
          label="I have read and agree to the statement above"
          error={errors.consentBackgroundCheck?.message}
          {...register("consentBackgroundCheck")}
        />
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Signature (type full name)" error={errors.signatureName?.message} {...register("signatureName")} />
          <TextInput label="Date" type="date" error={errors.signatureDate?.message} {...register("signatureDate")} />
        </div>
      </div>

      {serverError && <p className="text-sm font-medium text-brand-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-press w-full rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
