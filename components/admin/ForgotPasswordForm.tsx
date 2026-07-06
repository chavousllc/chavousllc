"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { TextInput } from "@/components/form/inputs";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas";
import { requestPasswordReset } from "@/actions/admin-auth";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    await requestPasswordReset(data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="h-10 w-10 text-brand-600" />
        <p className="text-sm text-ink-600">
          If an account exists for that email, a password reset link is on
          its way. It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <TextInput
        label="Admin Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-press w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
