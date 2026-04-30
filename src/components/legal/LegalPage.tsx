import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";

export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <div className="prose prose-neutral mt-6 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {body || "_(Contenu à compléter via l'admin.)_"}
          </ReactMarkdown>
        </div>
      </Container>
    </Section>
  );
}
