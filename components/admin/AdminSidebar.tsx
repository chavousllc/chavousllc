"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileEdit,
  FileText,
  Truck,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import { LogoMark } from "@/components/Logo";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/content", label: "Site Content", icon: FileEdit },
  { href: "/admin/applications", label: "Driver Applications", icon: Truck },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col bg-ink-900 text-ink-300">
      <div className="flex items-center gap-2.5 border-b border-ink-800 px-6 py-5">
        <LogoMark />
        <div>
          <p className="text-sm font-bold text-white">Chavous Admin</p>
          <p className="text-xs text-ink-500">Content & submissions</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "text-ink-300 hover:bg-ink-800 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-800 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
        <p className="mt-2 truncate px-3 text-xs text-ink-600">{adminName}</p>
      </div>
    </aside>
  );
}
