"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import {
  applicationSchema,
  APPLICATION_STEPS,
  STEP_FIELDS,
  DOCUMENT_TYPES,
  type ApplicationInput,
} from "@/lib/schemas";
import {
  startDraftApplication,
  loadDraftApplication,
  saveDraftStep,
} from "@/actions/apply-draft";
import { submitDriverApplication } from "@/actions/apply";
import { ApplicationIdBar } from "@/components/apply/ApplicationIdBar";
import { Stepper } from "@/components/apply/Stepper";
import { StepDriverType } from "@/components/apply/StepDriverType";
import { StepPersonalInfo } from "@/components/apply/StepPersonalInfo";
import { StepExperience } from "@/components/apply/StepExperience";
import { StepDocuments, type UploadedDocument } from "@/components/apply/StepDocuments";
import { StepBanking } from "@/components/apply/StepBanking";
import { StepSubmit } from "@/components/apply/StepSubmit";

const LOCAL_STORAGE_KEY = "chavous-apply-draft";

const defaultValues: Partial<ApplicationInput> = {
  fullName: "",
  email: "",
  phone: "",
  ssn: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dateOfBirth: "",
  positionAppliedFor: "",
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
  bankName: "",
  bankRoutingNumber: "",
  bankAccountNumber: "",
  consentBackgroundCheck: false,
  signatureName: "",
  signatureDate: "",
};

function readStoredDraft(): { resumeToken: string; applicationCode: string } | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeDraft(resumeToken: string, applicationCode: string) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ resumeToken, applicationCode }));
}

export function ApplyForm({ resumeParam }: { resumeParam?: string }) {
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });

  const [ready, setReady] = useState(false);
  const [applicationCode, setApplicationCode] = useState("");
  const [resumeToken, setResumeToken] = useState("");
  const [step, setStep] = useState(0);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const initialized = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startInit() {
    setInitError(null);

    async function init() {
      const tokenToResume = resumeParam || readStoredDraft()?.resumeToken;
      if (tokenToResume) {
        const result = await loadDraftApplication(tokenToResume);
        if (result.success) {
          form.reset(result.data as ApplicationInput);
          setStep(result.currentStep);
          setDocuments(result.documents);
          setApplicationCode(result.applicationCode);
          setResumeToken(tokenToResume);
          storeDraft(tokenToResume, result.applicationCode);
          setReady(true);
          return;
        }
      }
      const draft = await startDraftApplication();
      setApplicationCode(draft.applicationCode);
      setResumeToken(draft.resumeToken);
      storeDraft(draft.resumeToken, draft.applicationCode);
      setReady(true);
    }

    init().catch(() => {
      setInitError("We couldn't load the application right now. Please check your connection and try again.");
    });
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    startInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave while typing.
  useEffect(() => {
    if (!ready || !resumeToken) return;
    const subscription = form.watch(() => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveState("saving");
      saveTimer.current = setTimeout(async () => {
        await saveDraftStep(resumeToken, step, form.getValues());
        setSaveState("saved");
      }, 800);
    });
    return () => subscription.unsubscribe();
  }, [ready, resumeToken, step, form]);

  async function saveNow(nextStep: number) {
    if (!resumeToken) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    await saveDraftStep(resumeToken, nextStep, form.getValues());
    setSaveState("saved");
  }

  async function goNext() {
    const stepKey = APPLICATION_STEPS[step];
    const valid = await form.trigger(STEP_FIELDS[stepKey]);
    if (!valid) return;

    if (stepKey === "documents") {
      const uploadedTypes = new Set(documents.map((d) => d.type));
      const missing = DOCUMENT_TYPES.filter((d) => d.required && !uploadedTypes.has(d.value));
      if (missing.length > 0) {
        setDocumentsError(`Please upload: ${missing.map((d) => d.label).join(", ")}`);
        return;
      }
      setDocumentsError(null);
    }

    const nextStep = Math.min(step + 1, APPLICATION_STEPS.length - 1);
    setStep(nextStep);
    await saveNow(nextStep);
  }

  async function goPrevious() {
    const prevStep = Math.max(step - 1, 0);
    setStep(prevStep);
    await saveNow(prevStep);
  }

  async function onSubmit(data: ApplicationInput) {
    setServerError(null);
    const result = await submitDriverApplication(resumeToken, data);
    if (result.success) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSubmitted(true);
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
          Thanks for applying to drive with us. A copy of your application was emailed to you, and our hiring team
          will be in touch.
        </p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-brand-600">{initError}</p>
        <button
          type="button"
          onClick={startInit}
          className="btn-press rounded-full border border-ink-200 px-5 py-2 text-sm font-semibold text-ink-700 hover:border-ink-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-12 text-center text-sm text-ink-400 shadow-sm">
        Loading your application…
      </div>
    );
  }

  const isLastStep = step === APPLICATION_STEPS.length - 1;

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <ApplicationIdBar applicationCode={applicationCode} resumeToken={resumeToken} saveState={saveState} />
        <Stepper step={step} />

        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm sm:p-10">
          {step === 0 && <StepDriverType />}
          {step === 1 && <StepPersonalInfo />}
          {step === 2 && <StepExperience />}
          {step === 3 && (
            <>
              <StepDocuments resumeToken={resumeToken} documents={documents} onDocumentsChange={setDocuments} />
              {documentsError && <p className="mt-4 text-sm font-medium text-brand-600">{documentsError}</p>}
            </>
          )}
          {step === 4 && <StepBanking />}
          {step === 5 && <StepSubmit serverError={serverError} />}

          <div className="mt-10 flex items-center justify-between border-t border-ink-100 pt-6">
            <button
              type="button"
              onClick={goPrevious}
              disabled={step === 0}
              className="btn-press inline-flex items-center gap-2 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            {isLastStep ? (
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="btn-press rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
              >
                {form.formState.isSubmitting ? "Submitting…" : "Submit Application"}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
