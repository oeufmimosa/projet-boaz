import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FrenchBadge } from "@/components/brand/FrenchBadge";

export function HeroMobile({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden bg-primary-800 text-text-inverse">
      <div aria-hidden className="absolute inset-0 hex-pattern opacity-50" />
      <Container className="relative flex flex-col items-center py-10 text-center">
        <FrenchBadge variant="dark" />
        <h1 className="mt-5 text-display-lg font-display text-balance">{title}</h1>
        <p className="mt-3 text-body-lg text-primary-100">{subtitle}</p>

        <Link
          href="/simulateur"
          className="mt-6 flex h-14 w-full items-center justify-between gap-2 rounded-md bg-accent-500 px-5 text-primary-800 font-display font-semibold shadow-lg hover:bg-accent-600"
        >
          <span>Estimer mes aides en 2 min</span>
          <span aria-hidden className="relative inline-flex h-9 w-8 items-center justify-center">
            <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full">
              <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-700)" />
            </svg>
            <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-text-inverse" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </Link>

        <ul className="mt-4 flex w-full items-center justify-between gap-2 text-body-sm text-primary-100">
          <ReassuranceItem color="var(--color-fr-blue)" label="Gratuit" />
          <Sep />
          <ReassuranceItem color="var(--color-fr-white)" label="Sans engagement" />
          <Sep />
          <ReassuranceItem color="var(--color-fr-red)" label="100 % en ligne" />
        </ul>
      </Container>
    </section>
  );
}

function ReassuranceItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex flex-1 items-center justify-center gap-1.5">
      <span aria-hidden style={{ color }}>✓</span>
      <span>{label}</span>
    </li>
  );
}

function Sep() {
  return <span aria-hidden className="h-3 w-px bg-primary-700" />;
}
