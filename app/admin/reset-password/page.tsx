import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-50/60 px-6 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-ink-900">
          Set New Password
        </h1>

        {!token ? (
          <p className="mt-6 text-center text-sm text-ink-500">
            This reset link is missing its token. Request a new one from the{" "}
            <Link href="/admin/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
              forgot password
            </Link>{" "}
            page.
          </p>
        ) : (
          <div className="mt-6">
            <ResetPasswordForm token={token} />
          </div>
        )}

        <p className="mt-5 text-center text-sm">
          <Link href="/admin/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
