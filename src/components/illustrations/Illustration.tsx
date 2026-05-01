import { ILLUSTRATIONS } from "./index";
import { cn } from "@/components/ui/cn";

const SIZE_MAP = { sm: 64, md: 96, lg: 128 } as const;

/**
 * Rendu d'une illustration par clé. Si la clé est inconnue, ne rend rien
 * (le caller a la responsabilité d'avoir une fallback UI).
 */
export function Illustration({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof SIZE_MAP | number;
  className?: string;
}) {
  const Component = ILLUSTRATIONS[name];
  if (!Component) return null;
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  return <Component size={px} className={cn("inline-block", className)} />;
}
