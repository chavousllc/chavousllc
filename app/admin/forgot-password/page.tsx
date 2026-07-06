import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-50/60 px-6 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-ink-900">
          Reset Admin Password
        </h1>
        <p className="mt-2 text-center text-sm text-ink-500">
          Enter your admin email and we&apos;ll send you a link to set a new
          password.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="mt-5 text-center text-sm">
          <Link href="/admin/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
