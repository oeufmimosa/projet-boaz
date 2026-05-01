import { cn } from "./cn";

export function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface border border-border shadow-sm p-6 sm:p-8",
        hover && "transition duration-150 hover:-translate-y-1 hover:shadow-md hover:border-primary-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "muted" | "dark";
}) {
  const toneClass =
    tone === "muted"
      ? "bg-surface-2"
      : tone === "dark"
      ? "bg-primary-700 text-text-inverse"
      : "";
  return (
    <section id={id} className={cn("py-16 sm:py-20", toneClass, className)}>
      {children}
    </section>
  );
}
