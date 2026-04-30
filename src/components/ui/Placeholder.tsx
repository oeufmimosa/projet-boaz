import { cn } from "./cn";

/** Generic gray placeholder block for "missing" content / image. */
export function Placeholder({
  label,
  className,
  ratio = "16/9",
}: {
  label?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "placeholder-block flex w-full items-center justify-center rounded text-sm",
        className,
      )}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label ?? "Placeholder"}
    >
      <span className="px-2 text-center">{label ?? "[placeholder]"}</span>
    </div>
  );
}
