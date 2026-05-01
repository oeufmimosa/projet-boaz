"use client";

import { ChatAvatar } from "@/components/chatbox/ChatAvatar";
import { cn } from "@/components/ui/cn";

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorCity: string;
  rating: number;
  context?: string | null;
}

/**
 * Témoignage flash affiché à côté du simulateur (desktop) ou sous forme
 * de bandeau replié sur mobile. Pas de carrousel : un seul à la fois,
 * sélectionné en amont (par étape ou aléatoirement).
 */
export function TestimonialFlash({
  item,
  className,
}: {
  item: TestimonialItem | null;
  className?: string;
}) {
  if (!item) return null;
  const initials = item.authorName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <aside
      role="complementary"
      className={cn(
        "rounded-lg border border-border bg-surface p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ChatAvatar initials={initials} size={36} variant="light" />
        <div className="flex-1 min-w-0">
          <p className="text-accent-500" aria-label={`Note ${item.rating} sur 5`}>
            {"★".repeat(item.rating)}
            <span className="text-primary-200">{"★".repeat(Math.max(0, 5 - item.rating))}</span>
          </p>
          <blockquote className="mt-1 text-body italic">« {item.quote} »</blockquote>
          <p className="mt-2 text-body-sm">
            <span className="font-semibold">{item.authorName}</span>
            <span className="text-text-muted">, {item.authorCity}</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
