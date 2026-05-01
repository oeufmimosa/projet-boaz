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
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-container",
        // padding latéral fluide via token
        className,
      )}
      style={{ paddingLeft: "var(--container-padding)", paddingRight: "var(--container-padding)" }}
    >
      {children}
    </Tag>
  );
}
