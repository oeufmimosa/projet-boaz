import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TricolorAccent } from "@/components/brand/TricolorBar";

export function RelaunchCTA() {
  return (
    <section className="bg-primary-700 py-10 text-text-inverse">
      <Container className="text-center">
        <h2 className="text-display-md font-display">Prêt à passer à l'action ?</h2>
        <TricolorAccent className="mx-auto mt-2" />
        <p className="mt-3 text-body-lg text-primary-100">
          La simulation est gratuite, sans engagement, et prend moins de 2 minutes.
        </p>
        <Link
          href="/simulateur"
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-accent-500 px-5 font-display font-semibold text-primary-800 hover:bg-accent-600"
        >
          Lancer ma simulation gratuite
        </Link>
      </Container>
    </section>
  );
}
