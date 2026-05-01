"use client";

import { useState } from "react";
import { Input, Textarea, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/client-csrf";

type ContentType = "TEXT" | "RICHTEXT" | "JSON" | "IMAGE_REF";
interface Item { id: string; key: string; value: string; type: ContentType }

export function ContentEditor({ items: initial }: { items: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [filter, setFilter] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const filtered = items.filter((i) => i.key.toLowerCase().includes(filter.toLowerCase()));

  const updateLocal = (id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const save = async (item: Item) => {
    setSaved(null);
    const res = await adminFetch("/api/content", {
      method: "PUT",
      body: JSON.stringify({ key: item.key, value: item.value, type: item.type }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setSaved(`Enregistré : ${item.key}`);
    else setSaved(`Erreur : ${body?.error ?? "inconnue"}`);
  };

  const remove = async (item: Item) => {
    if (!confirm(`Supprimer la clé "${item.key}" ?`)) return;
    const res = await adminFetch(`/api/content?key=${encodeURIComponent(item.key)}`, {
      method: "DELETE",
    });
    if (res.ok) setItems((p) => p.filter((i) => i.id !== item.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Filtrer par clé…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
        {saved && <p className="text-sm text-accent-500">{saved}</p>}
      </div>

      <ul className="space-y-3">
        {filtered.map((item) => (
          <li key={item.id} className="rounded-md border border-border bg-surface p-4">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <code className="text-xs text-text-muted">{item.key}</code>
              <select
                value={item.type}
                onChange={(e) => updateLocal(item.id, { type: e.target.value as ContentType })}
                className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
              >
                <option value="TEXT">TEXT</option>
                <option value="RICHTEXT">RICHTEXT (markdown)</option>
                <option value="JSON">JSON</option>
                <option value="IMAGE_REF">IMAGE_REF (url)</option>
              </select>
              <div className="ml-auto flex gap-2">
                <Button size="sm" onClick={() => save(item)}>Enregistrer</Button>
                <Button size="sm" variant="danger" onClick={() => remove(item)}>Supprimer</Button>
              </div>
            </div>
            {item.type === "TEXT" || item.type === "IMAGE_REF" ? (
              <Input value={item.value} onChange={(e) => updateLocal(item.id, { value: e.target.value })} />
            ) : (
              <Textarea value={item.value} onChange={(e) => updateLocal(item.id, { value: e.target.value })} />
            )}
          </li>
        ))}
      </ul>

      <NewKey onCreate={(item) => setItems((p) => [...p, item].sort((a, b) => a.key.localeCompare(b.key)))} />
    </div>
  );
}

function NewKey({ onCreate }: { onCreate: (item: Item) => void }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<ContentType>("TEXT");
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    const res = await adminFetch("/api/content", {
      method: "PUT",
      body: JSON.stringify({ key, value, type }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body?.error ?? "Erreur");
      return;
    }
    onCreate({ id: body.data.id, key, value, type });
    setKey(""); setValue("");
  };

  return (
    <div className="rounded border border-dashed border-border p-4">
      <h2 className="mb-3 font-semibold">Ajouter une clé</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <FieldWrap label="Clé" htmlFor="new-key">
          <Input id="new-key" placeholder="ex: home.hero.title" value={key} onChange={(e) => setKey(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Type" htmlFor="new-type">
          <select id="new-type" value={type} onChange={(e) => setType(e.target.value as ContentType)} className="w-full rounded-md border border-border bg-surface px-3 py-2">
            <option value="TEXT">TEXT</option>
            <option value="RICHTEXT">RICHTEXT</option>
            <option value="JSON">JSON</option>
            <option value="IMAGE_REF">IMAGE_REF</option>
          </select>
        </FieldWrap>
        <div className="self-end">
          <Button onClick={create}>Créer</Button>
        </div>
      </div>
      <FieldWrap label="Valeur" htmlFor="new-value" error={error ?? undefined}>
        <Textarea id="new-value" value={value} onChange={(e) => setValue(e.target.value)} />
      </FieldWrap>
    </div>
  );
}
