"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { TextInput, TextArea } from "@/components/form/inputs";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { submitContactMessage } from "@/actions/contact";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    try {
      const result = await submitContactMessage(data);
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
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50/60 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand-600" />
        <p className="text-lg font-bold text-ink-900">Message sent</p>
        <p className="text-sm text-ink-500">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <TextInput label="Full Name" placeholder="John Smith" required error={errors.name?.message} {...register("name")} />
      <TextInput label="Email" type="email" placeholder="john@example.com" required error={errors.email?.message} {...register("email")} />
      <TextInput label="Phone (optional)" type="tel" placeholder="(555) 123-4567" error={errors.phone?.message} {...register("phone")} />
      <TextArea
        label="How can we help?"
        placeholder="Tell us about your shipment or question…"
        required
        error={errors.message?.message}
        {...register("message")}
      />
      {serverError && <p className="text-sm font-medium text-brand-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-press w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
