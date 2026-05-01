import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "./cn";

const baseField = [
  "w-full rounded-md bg-surface text-text",
  "placeholder:text-text-muted",
  "border-1.5 border-border",
  "px-3.5 py-2.5",
  "text-body",
  // h-11 desktop ; sur mobile (< 768) on ajoute h-13 via classe pour éviter
  // le zoom iOS au focus (font-size doit rester ≥ 16 px en TS).
  "h-11 sm:h-11",
  "transition duration-150",
  "focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-300/50",
  "aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/30",
  "disabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-70",
].join(" ");

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(baseField, className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(baseField, "min-h-[120px] py-3 h-auto", className)}
        {...props}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(baseField, "appearance-none pr-10", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function FieldWrap({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-body-sm font-semibold text-text">
        {label}
        {required && <span className="ml-1 text-error" aria-hidden>*</span>}
      </label>
      {hint && <p className="text-body-sm text-text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
