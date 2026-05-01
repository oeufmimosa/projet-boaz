import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TricolorAccent } from "@/components/brand/TricolorBar";

export function MiniFAQ({ items }: { items: { q: string; a: string }[] }) {
  // 4 max sur mobile
  const top = items.slice(0, 4);
  return (
    <section className="bg-surface-2 py-10">
      <Container>
        <h2 className="text-display-md font-display">Questions fréquentes</h2>
        <TricolorAccent className="mt-2" />

        <ul className="mt-5 space-y-2">
          {top.map((it, i) => (
            <li key={i}>
              <details className="group rounded-md border border-border bg-surface p-4 open:border-primary-300">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-body font-semibold">
                  <span>{it.q}</span>
                  <span aria-hidden className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-primary-700 transition-transform group-open:rotate-45">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-2 text-body text-text-muted">{it.a}</p>
              </details>
            </li>
          ))}
        </ul>

        <Link
          href="#faq"
          className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 hover:text-primary-600"
        >
          Voir toute la FAQ →
        </Link>
      </Container>
    </section>
  );
}
