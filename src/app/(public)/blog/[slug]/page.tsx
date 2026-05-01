import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!a || !a.published) return {};
  return { title: a.title, description: a.excerpt ?? undefined };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!article || !article.published) notFound();

  return (
    <Section>
      <Container className="max-w-3xl">
        <Link href="/blog" className="text-sm text-primary">← Tous les articles</Link>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{article.title}</h1>
        {article.publishedAt && (
          <p className="mt-2 text-sm text-text-muted">
            Publié le {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        {article.coverImage && (
          <img src={article.coverImage} alt="" className="mt-6 w-full rounded" />
        )}
        <div className="prose prose-neutral mt-8 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </Container>
    </Section>
  );
}
