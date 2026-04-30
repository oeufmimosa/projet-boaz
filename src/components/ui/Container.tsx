import { cn } from "./cn";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return <Tag className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</Tag>;
}
