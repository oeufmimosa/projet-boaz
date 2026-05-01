"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TricolorAccent } from "@/components/brand/TricolorBar";

type Item = { name: string; city: string; quote: string; rating: number };

export function Testimonials({ title, items }: { title: string; items: Item[] }) {
  const [idx, setIdx] = useState(0);
  if (items.length === 0) return null;
  const cur = items[idx % items.length];

  return (
    <section className="border-y border-border bg-surface-2 py-16 sm:py-20">
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-display-md font-display">{title}</h2>
          <TricolorAccent className="mt-3" />
        </div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-8 shadow-sm sm:p-12">
          {/* Guillemet décoratif vert clair */}
          <span aria-hidden className="absolute -right-4 -top-4 font-display text-[10rem] leading-none text-primary-100 select-none pointer-events-none">
            &rdquo;
          </span>
          <div className="relative">
            <p aria-label={`Note ${cur.rating} sur 5`} className="text-accent-500 text-body-lg">
              {"★".repeat(cur.rating)}
              <span className="text-primary-200">{"★".repeat(Math.max(0, 5 - cur.rating))}</span>
            </p>
            <blockquote className="mt-3 text-display-sm font-display italic">« {cur.quote} »</blockquote>
            <div className="mt-5 flex items-center gap-3">
              <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-display font-bold text-primary-700">
                {cur.name.charAt(0)}
              </span>
              <p className="text-body-sm">
                <span className="font-semibold">{cur.name}</span>
                <span className="text-text-muted"> — {cur.city}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Témoignages">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Témoignage ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 w-10 rounded-sm transition-colors ${i === idx ? "bg-primary-700" : "bg-border"}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
