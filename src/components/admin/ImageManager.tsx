"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminFetch } from "@/lib/client-csrf";

interface Item {
  id: string;
  key: string | null;
  url: string;
  originalName: string;
  size: number;
}

export function ImageManager({ items: initial }: { items: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        headers: { "x-csrf-token": (document.cookie.match(/bz_csrf=([^;]+)/)?.[1] ?? "") },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error ?? "Erreur upload");
        return;
      }
      setItems((prev) => [body.data, ...prev]);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  const updateKey = async (id: string, key: string) => {
    const res = await adminFetch(`/api/upload/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ key }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, key } : it)));
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    const res = await adminFetch(`/api/upload/${id}`, { method: "DELETE" });
    if (res.ok) setItems((p) => p.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="rounded border border-dashed border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="text-sm"
          />
          <Button onClick={upload} disabled={uploading}>
            {uploading ? "Upload…" : "Uploader"}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.id} className="rounded border border-border bg-white p-3">
            <img src={it.url} alt="" className="aspect-video w-full rounded object-cover" />
            <p className="mt-2 truncate text-xs text-muted-fg">{it.originalName} — {Math.round(it.size / 1024)} Ko</p>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Clé (ex: home.hero.image)"
                defaultValue={it.key ?? ""}
                onBlur={(e) => updateKey(it.id, e.target.value)}
                className="flex-1"
              />
              <Button size="sm" variant="danger" onClick={() => remove(it.id)}>×</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
