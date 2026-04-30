"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/client-csrf";

export interface ArticleData {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
}

export function ArticleForm({ initial }: { initial: ArticleData }) {
  const router = useRouter();
  const [data, setData] = useState<ArticleData>(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const upd = <K extends keyof ArticleData>(k: K, v: ArticleData[K]) =>
    setData((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setError(null);
    setBusy(true);
    try {
      const isUpdate = Boolean(data.id);
      const res = await adminFetch(isUpdate ? `/api/articles/${data.id}` : "/api/articles", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify({
          slug: data.slug, title: data.title, excerpt: data.excerpt,
          content: data.content, coverImage: data.coverImage, published: data.published,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error ?? "Erreur");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!data.id || !confirm("Supprimer cet article ?")) return;
    const res = await adminFetch(`/api/articles/${data.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldWrap label="Titre" htmlFor="a-title" required>
          <Input id="a-title" value={data.title} onChange={(e) => upd("title", e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Slug" htmlFor="a-slug" required>
          <Input id="a-slug" value={data.slug} onChange={(e) => upd("slug", e.target.value)} />
        </FieldWrap>
      </div>
      <FieldWrap label="Image de couverture (URL)" htmlFor="a-cover">
        <Input id="a-cover" value={data.coverImage} onChange={(e) => upd("coverImage", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Extrait" htmlFor="a-excerpt">
        <Textarea id="a-excerpt" value={data.excerpt} onChange={(e) => upd("excerpt", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Contenu (Markdown)" htmlFor="a-content" required>
        <Textarea id="a-content" value={data.content} onChange={(e) => upd("content", e.target.value)} className="min-h-[400px] font-mono" />
      </FieldWrap>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={data.published} onChange={(e) => upd("published", e.target.checked)} className="h-4 w-4" />
        Publié
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-between">
        {data.id ? <Button variant="danger" onClick={remove}>Supprimer</Button> : <span />}
        <Button onClick={save} disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </div>
  );
}
