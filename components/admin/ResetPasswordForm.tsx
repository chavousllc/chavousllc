"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { TextInput } from "@/components/form/inputs";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/schemas";
import { resetPassword } from "@/actions/admin-auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    const result = await resetPassword(data);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } else {
      setServerError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand-600" />
        <p className="text-sm text-ink-600">
          Password updated. Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register("token")} />
      <TextInput
        label="New Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <TextInput
        label="Confirm New Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {serverError && <p className="text-sm font-medium text-brand-600">{serverError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-press w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Set New Password"}
      </button>
    </form>
  );
}
