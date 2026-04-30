"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";

type Item = { name: string; city: string; quote: string; rating: number };

export function Testimonials({ title, items }: { title: string; items: Item[] }) {
  const [idx, setIdx] = useState(0);
  if (items.length === 0) return null;
  const cur = items[idx % items.length];

  return (
    <section className="border-y border-border bg-muted/30 py-12 sm:py-16">
      <Container>
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{title}</h2>
        <div className="rounded border border-border bg-white p-6 sm:p-8">
          <p aria-label={`Note: ${cur.rating} sur 5`} className="text-yellow-500">
            {"★".repeat(cur.rating)}{"☆".repeat(Math.max(0, 5 - cur.rating))}
          </p>
          <blockquote className="mt-3 text-lg italic">« {cur.quote} »</blockquote>
          <p className="mt-3 text-sm text-muted-fg">— {cur.name}, {cur.city}</p>
        </div>
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Témoignages">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Témoignage ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 w-8 rounded ${i === idx ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
