"use client";

import { useState } from "react";
import { Copy, Link as LinkIcon, Check, Info } from "lucide-react";

export function ApplicationIdBar({
  applicationCode,
  resumeToken,
  saveState,
}: {
  applicationCode: string;
  resumeToken: string;
  saveState: "idle" | "saving" | "saved";
}) {
  const [copied, setCopied] = useState<"id" | "link" | null>(null);

  function copy(kind: "id" | "link") {
    const text = kind === "id" ? applicationCode : `${window.location.origin}/apply?resume=${resumeToken}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-500">Application ID:</span>
          <span className="font-mono font-semibold text-brand-600">{applicationCode}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copy("id")}
            className="btn-press inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-700 hover:border-ink-300"
          >
            {copied === "id" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy ID
          </button>
          <button
            type="button"
            onClick={() => copy("link")}
            className="btn-press inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-700 hover:border-ink-300"
          >
            {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
            Copy resume link
          </button>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-400">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <span>
          Your progress is saved automatically{saveState === "saving" ? " — saving…" : ""}. Copy the resume link to
          finish later on any device — or send it to someone who can continue filling it out with the info already
          entered. For security, a shared link shows only the last 4 digits of any SSN or bank account.
        </span>
      </p>
    </div>
  );
}
