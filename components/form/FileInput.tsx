"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import clsx from "clsx";

export function FileInput({
  label,
  required,
  fileName,
  uploading,
  error,
  onSelect,
  onRemove,
  className,
}: {
  label: string;
  required?: boolean;
  fileName?: string;
  uploading?: boolean;
  error?: string;
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className={className}>
      <span className="text-sm font-semibold text-ink-800">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </span>
      <div
        onDragOver={
          onSelect
            ? (e) => {
                e.preventDefault();
                setDragActive(true);
              }
            : undefined
        }
        onDragLeave={onSelect ? () => setDragActive(false) : undefined}
        onDrop={
          onSelect
            ? (e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) onSelect(file);
              }
            : undefined
        }
        onClick={onSelect ? () => inputRef.current?.click() : undefined}
        className={clsx(
          "mt-1.5 flex items-center gap-3 rounded-lg border border-dashed px-3.5 py-3 text-sm transition-colors",
          onSelect && "cursor-pointer",
          dragActive ? "border-brand-500 bg-brand-50" : "border-ink-200 bg-white hover:border-ink-300",
          fileName && "border-solid border-ink-200"
        )}
      >
        {onSelect && (
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSelect(file);
              e.target.value = "";
            }}
          />
        )}
        {fileName ? (
          <>
            <FileText className="h-4 w-4 flex-shrink-0 text-brand-600" />
            <span className="min-w-0 flex-1 truncate text-ink-800">{fileName}</span>
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="flex-shrink-0 text-ink-400 hover:text-brand-600"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 flex-shrink-0 text-ink-400" />
            <span className="text-ink-500">
              {uploading ? "Uploading…" : "Click or drag a PDF, JPG, or PNG (max 10MB)"}
            </span>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-brand-600">{error}</p>}
    </div>
  );
}
