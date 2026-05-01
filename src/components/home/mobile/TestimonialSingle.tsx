import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface Item { name: string; city: string; quote: string; rating: number }

export function TestimonialSingle({ item }: { item: Item | undefined }) {
  if (!item) return null;
  return (
    <section className="bg-bg py-10">
      <Container>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-accent-500" aria-label={`Note ${item.rating} sur 5`}>
            {"★".repeat(item.rating)}
            <span className="text-primary-200">{"★".repeat(Math.max(0, 5 - item.rating))}</span>
          </p>
          <blockquote className="mt-2 text-body italic">« {item.quote} »</blockquote>
          <p className="mt-3 text-body-sm">
            <span className="font-semibold">{item.name}</span>
            <span className="text-text-muted"> — {item.city}</span>
          </p>
        </div>
        <Link
          href="#avis"
          className="mt-3 inline-flex text-body-sm font-semibold text-primary-700 hover:text-primary-600"
        >
          Voir tous les avis →
        </Link>
      </Container>
    </section>
  );
}
