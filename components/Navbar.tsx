"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import clsx from "clsx";

const LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/coverage", label: "Coverage" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const sentinel = document.getElementById("home-hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 flex h-20 items-center transition-colors duration-300",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-ink-100 bg-white/90 backdrop-blur"
      )}
    >
      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-6 lg:px-8">
        <Link href="/#home" onClick={() => setOpen(false)}>
          <Logo light={transparent} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-semibold transition-colors hover:text-brand-600",
                pathname === link.href
                  ? "text-brand-600"
                  : transparent
                    ? "text-white"
                    : "text-ink-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/apply"
            className={clsx(
              "btn-press rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:border-brand-600 hover:text-brand-600",
              transparent
                ? "border-white/40 text-white"
                : "border-ink-200 text-ink-800"
            )}
          >
            Apply to Drive
          </Link>
          <Link
            href="/quote"
            className="btn-press rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          className={clsx(
            "btn-press flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden",
            transparent ? "border-white/40" : "border-ink-200"
          )}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-4">
            <span
              className={clsx(
                "absolute left-0 top-0 h-0.5 w-4 transition-transform",
                transparent ? "bg-white" : "bg-ink-800",
                open && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-1.5 h-0.5 w-4 transition-opacity",
                transparent ? "bg-white" : "bg-ink-800",
                open && "opacity-0"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-3 h-0.5 w-4 transition-transform",
                transparent ? "bg-white" : "bg-ink-800",
                open && "-translate-y-[6px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-ink-100 bg-white px-6 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-ink-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="btn-press rounded-full border border-ink-200 px-4 py-2 text-center text-sm font-semibold text-ink-800"
            >
              Apply to Drive
            </Link>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="btn-press rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
