import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata = { title: "Nouvel article" };

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nouvel article</h1>
      <ArticleForm initial={{ slug: "", title: "", excerpt: "", content: "", coverImage: "", published: false }} />
    </div>
  );
}
