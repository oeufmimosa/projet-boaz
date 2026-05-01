"use client";

import { useState } from "react";
import { Input, Textarea, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/client-csrf";

type ContentType = "TEXT" | "RICHTEXT" | "JSON" | "IMAGE_REF";
interface Item { id: string; key: string; value: string; type: ContentType }

/**
 * Réutilise l'API /api/content (PUT) déjà CSRF-protégée. Une carte par clé,
 * textarea pour les options JSON et inputs pour le reste.
 */
export function ChatboxEditor({ items: initial }: { items: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [msg, setMsg] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Item>) =>
    setItems((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const save = async (item: Item) => {
    setMsg(null);
    if (item.type === "JSON") {
      try { JSON.parse(item.value); } catch { setMsg(`JSON invalide pour ${item.key}`); return; }
    }
    const res = await adminFetch("/api/content", {
      method: "PUT",
      body: JSON.stringify({ key: item.key, value: item.value, type: item.type }),
    });
    setMsg(res.ok ? `Enregistré : ${item.key}` : "Erreur");
  };

  return (
    <div className="space-y-4">
      {msg && <p className="text-body-sm text-success">{msg}</p>}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-border bg-surface p-4">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <code className="text-body-sm text-text-muted">{item.key}</code>
              <span className="text-body-sm text-text-muted">— {item.type}</span>
              <div className="ml-auto">
                <Button size="sm" onClick={() => save(item)}>Enregistrer</Button>
              </div>
            </div>
            {item.type === "JSON" ? (
              <FieldWrap label="Options (JSON)" htmlFor={item.id}>
                <Textarea
                  id={item.id}
                  value={item.value}
                  onChange={(e) => update(item.id, { value: e.target.value })}
                  className="font-mono text-body-sm"
                />
              </FieldWrap>
            ) : (
              <FieldWrap label="Valeur" htmlFor={item.id}>
                <Input
                  id={item.id}
                  value={item.value}
                  onChange={(e) => update(item.id, { value: e.target.value })}
                />
              </FieldWrap>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
