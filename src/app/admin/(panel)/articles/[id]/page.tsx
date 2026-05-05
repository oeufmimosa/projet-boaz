import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata = { title: "Édition article" };
export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const a = await prisma.article.findUnique({ where: { id: params.id } });
  if (!a) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Édition : {a.title}</h1>
      <ArticleForm initial={{
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt ?? "",
        content: a.content,
        coverImage: a.coverImage ?? "",
        published: a.published,
      }} />
    </div>
  );
}
