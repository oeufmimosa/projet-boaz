import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { getContent } from "@/lib/content";

export const metadata = { title: "Merci" };

export default async function MerciPage() {
  const [title, body] = await Promise.all([
    getContent("simulator.merci.title", "Merci !"),
    getContent("simulator.merci.body"),
  ]);
  return (
    <Section>
      <Container className="max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
          ✓
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-fg">{body}</p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/" variant="secondary">Retour à l'accueil</LinkButton>
          <LinkButton href="/blog">Lire le blog</LinkButton>
        </div>
      </Container>
    </Section>
  );
}
