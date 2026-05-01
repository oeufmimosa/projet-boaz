"use client";

import { useState } from "react";
import { Input, Textarea, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/client-csrf";

interface Item {
  id?: string;
  quote: string;
  authorName: string;
  authorCity: string;
  rating: number;
  context: string | null;
  active: boolean;
  order: number;
}

const empty = (order: number): Item => ({
  quote: "", authorName: "", authorCity: "", rating: 5, context: "", active: true, order,
});

export function TestimonialEditor({ items: initial }: { items: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [draft, setDraft] = useState<Item>(empty(initial.length));
  const [msg, setMsg] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Item>) =>
    setItems((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const save = async (it: Item) => {
    setMsg(null);
    if (!it.id) return;
    const res = await adminFetch(`/api/testimonials/admin/${it.id}`, {
      method: "PUT",
      body: JSON.stringify({
        quote: it.quote,
        authorName: it.authorName,
        authorCity: it.authorCity,
        rating: it.rating,
        context: it.context ?? "",
        active: it.active,
        order: it.order,
      }),
    });
    setMsg(res.ok ? `Enregistré : ${it.authorName}` : "Erreur");
  };

  const remove = async (it: Item) => {
    if (!it.id || !confirm(`Supprimer le témoignage de ${it.authorName} ?`)) return;
    const res = await adminFetch(`/api/testimonials/admin/${it.id}`, { method: "DELETE" });
    if (res.ok) setItems((p) => p.filter((x) => x.id !== it.id));
  };

  const create = async () => {
    setMsg(null);
    const res = await adminFetch("/api/testimonials/admin", {
      method: "POST",
      body: JSON.stringify({
        ...draft,
        context: draft.context ?? "",
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(body?.error ?? "Erreur"); return; }
    setItems((p) => [...p, { ...draft, id: body.data.id }]);
    setDraft(empty(items.length + 1));
  };

  return (
    <div className="space-y-4">
      {msg && <p className="text-body-sm text-success">{msg}</p>}

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="rounded-md border border-border bg-surface p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_120px_60px]">
              <FieldWrap label="Citation" htmlFor={`q-${it.id}`}>
                <Textarea id={`q-${it.id}`} value={it.quote} onChange={(e) => update(it.id!, { quote: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Nom" htmlFor={`n-${it.id}`}>
                <Input id={`n-${it.id}`} value={it.authorName} onChange={(e) => update(it.id!, { authorName: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Ville" htmlFor={`c-${it.id}`}>
                <Input id={`c-${it.id}`} value={it.authorCity} onChange={(e) => update(it.id!, { authorCity: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Note" htmlFor={`r-${it.id}`}>
                <Input id={`r-${it.id}`} type="number" min={1} max={5} value={it.rating}
                  onChange={(e) => update(it.id!, { rating: Number(e.target.value) || 5 })} />
              </FieldWrap>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_120px_120px_auto]">
              <FieldWrap label="Contexte (ex. PAC)" htmlFor={`ctx-${it.id}`}>
                <Input id={`ctx-${it.id}`} value={it.context ?? ""} onChange={(e) => update(it.id!, { context: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Ordre" htmlFor={`o-${it.id}`}>
                <Input id={`o-${it.id}`} type="number" value={it.order}
                  onChange={(e) => update(it.id!, { order: Number(e.target.value) || 0 })} />
              </FieldWrap>
              <FieldWrap label="Actif" htmlFor={`a-${it.id}`}>
                <input id={`a-${it.id}`} type="checkbox" checked={it.active} className="mt-3 h-5 w-5"
                  onChange={(e) => update(it.id!, { active: e.target.checked })} />
              </FieldWrap>
              <div className="flex items-end justify-end gap-2">
                <Button size="sm" variant="danger" onClick={() => remove(it)}>Supprimer</Button>
                <Button size="sm" onClick={() => save(it)}>Enregistrer</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-md border border-dashed border-border p-4">
        <h2 className="mb-3 font-semibold">Ajouter un témoignage</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_120px_60px]">
          <FieldWrap label="Citation" htmlFor="d-q">
            <Textarea id="d-q" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
          </FieldWrap>
          <FieldWrap label="Nom" htmlFor="d-n">
            <Input id="d-n" value={draft.authorName} onChange={(e) => setDraft({ ...draft, authorName: e.target.value })} />
          </FieldWrap>
          <FieldWrap label="Ville" htmlFor="d-c">
            <Input id="d-c" value={draft.authorCity} onChange={(e) => setDraft({ ...draft, authorCity: e.target.value })} />
          </FieldWrap>
          <FieldWrap label="Note" htmlFor="d-r">
            <Input id="d-r" type="number" min={1} max={5} value={draft.rating}
              onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) || 5 })} />
          </FieldWrap>
        </div>
        <div className="mt-3 flex justify-end">
          <Button onClick={create}>+ Créer</Button>
        </div>
      </div>
    </div>
  );
}
