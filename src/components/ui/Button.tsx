import Link from "next/link";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

/**
 * Tous les variants pointent exclusivement sur les tokens de couleur Tailwind
 * (primary-*, accent-*, surface, border…). Aucun hex ici.
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary-700 text-text-inverse hover:bg-primary-800 active:bg-primary-900",
  accent:
    "bg-accent-500 text-primary-800 hover:bg-accent-600 active:bg-accent-600",
  outline:
    "bg-transparent text-primary-700 border-1.5 border-primary-700 hover:bg-primary-50",
  ghost:
    "bg-transparent text-primary-700 hover:bg-primary-50",
  inverse:
    "bg-surface text-primary-700 hover:bg-primary-50",
  danger:
    "bg-error text-text-inverse hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-body-sm",
  md: "h-11 px-5 text-body",
  lg: "h-[52px] px-6 text-body-lg",
};

const baseClasses = [
  "inline-flex items-center justify-center gap-2",
  "rounded-md font-display font-semibold whitespace-nowrap",
  "transition duration-150",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "focus-visible:outline-none",
].join(" ");

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
});

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}
