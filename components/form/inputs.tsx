import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="text-sm font-semibold text-ink-800">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs font-medium text-brand-600">{error}</p>}
    </label>
  );
}

const baseInputClass =
  "w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition-colors placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
>(function TextInput({ label, error, className, ...props }, ref) {
  return (
    <Field label={label} error={error} className={className}>
      <input ref={ref} className={baseInputClass} {...props} />
    </Field>
  );
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }
>(function TextArea({ label, error, className, ...props }, ref) {
  return (
    <Field label={label} error={error} className={className}>
      <textarea ref={ref} rows={4} className={baseInputClass} {...props} />
    </Field>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; children: React.ReactNode }
>(function Select({ label, error, className, children, ...props }, ref) {
  return (
    <Field label={label} error={error} className={className}>
      <select ref={ref} className={baseInputClass} {...props}>
        {children}
      </select>
    </Field>
  );
});

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; error?: string }
>(function Checkbox({ label, error, className, ...props }, ref) {
  return (
    <div className={className}>
      <label className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
          {...props}
        />
        <span className="text-sm text-ink-700">{label}</span>
      </label>
      {error && <p className="mt-1 text-xs font-medium text-brand-600">{error}</p>}
    </div>
  );
});
