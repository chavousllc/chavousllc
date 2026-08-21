import Link from "next/link";
import { Logo } from "@/components/Logo";
import { telHref } from "@/lib/format";
import type { CompanyProfile } from "@prisma/client";

export function Footer({ profile }: { profile: CompanyProfile }) {
  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-ink-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo className="[&_span]:text-white [&_span_span]:text-brand-400" />
          <p className="mt-4 text-sm leading-relaxed text-ink-400">
            Freight transportation across the continental United States —
            reliable, safe, and on time.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/#services" className="hover:text-white">Services</Link></li>
            <li><Link href="/coverage" className="hover:text-white">Coverage Area</Link></li>
            <li><Link href="/apply" className="hover:text-white">Driver Application</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={telHref(profile.phone)} className="hover:text-white">
                {profile.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="hover:text-white">
                {profile.email}
              </a>
            </li>
            <li>{profile.dispatchHours}</li>
            <li>{profile.address}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Request Freight
          </h3>
          <p className="mt-4 text-sm text-ink-400">
            Shipping a load? Get a rate in minutes.
          </p>
          <Link
            href="/quote"
            className="btn-press mt-4 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-ink-500 sm:flex-row lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {profile.companyName}. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>{profile.dotNumber}</span>
            <span>{profile.mcNumber}</span>
            <Link href="/admin/login" className="hover:text-ink-300">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
