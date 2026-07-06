"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TextInput } from "@/components/form/inputs";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-50/60 px-6 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-xl font-bold text-ink-900">
          Admin Sign In
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <TextInput
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm font-medium text-brand-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-press w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm">
          <Link href="/admin/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
