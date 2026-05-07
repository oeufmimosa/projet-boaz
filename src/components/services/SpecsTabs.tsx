"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SpecGroup } from "@/lib/services";

/**
 * Tabs interactives pour les spécifications techniques d'un service.
 *
 * - Barre d'onglets en pills (badge hexagonal numéroté + nom de groupe)
 * - Onglet actif en vert plein, autres en outline
 * - Panel actif en carte blanche avec liste alternée label / valeur
 * - Transition douce entre onglets via AnimatePresence + motion
 * - Mobile : barre d'onglets scrollable horizontalement
 * - Accessible : roles tablist / tab / tabpanel + aria-selected
 */
export function SpecsTabs({ groups }: { groups: SpecGroup[] }) {
  const [active, setActive] = useState(0);
  const current = groups[active];

  return (
    <div>
      {/* Barre d'onglets */}
      <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
        <ul role="tablist" className="flex min-w-max gap-2 sm:flex-wrap">
          {groups.map((g, i) => {
            const isActive = i === active;
            return (
              <li key={g.title}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="specs-panel"
                  onClick={() => setActive(i)}
                  className={`group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-body-sm font-semibold transition ${
                    isActive
                      ? "border-primary-700 bg-primary-700 text-text-inverse shadow-sm"
                      : "border-border bg-surface text-text-muted hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center font-display text-[0.65rem] font-bold"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.22)" : "var(--color-primary-50)",
                      color: isActive ? "rgba(255,255,255,0.95)" : "var(--color-primary-700)",
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{g.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Panel actif avec transition */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          id="specs-panel"
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          {/* En-tête du panel */}
          <div className="flex items-center gap-3 border-b border-border pb-4 sm:gap-4">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-700 font-display text-body-sm font-bold text-text-inverse"
              style={{
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              {String(active + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl font-bold text-primary-800 sm:text-2xl">
              {current.title}
            </h3>
          </div>

          {/* Liste des specs en lignes label / valeur */}
          <dl className="divide-y divide-border">
            {current.items.map((item) => (
              <div
                key={item.label}
                className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-8 sm:py-4"
              >
                <dt className="font-semibold text-text">{item.label}</dt>
                <dd className="text-text-muted leading-relaxed">{item.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatePresence>

      {/* Indicateur visuel du nombre total d'onglets */}
      <p className="mt-4 text-center text-body-sm text-text-muted">
        {active + 1} / {groups.length} — naviguez avec les onglets ci-dessus
      </p>
    </div>
  );
}
