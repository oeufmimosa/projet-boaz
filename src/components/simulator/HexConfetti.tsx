"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "var(--color-primary-500)",
  "var(--color-primary-700)",
  "var(--color-accent-500)",
  "var(--color-fr-blue)",
  "var(--color-fr-red)",
];

interface Piece {
  id: number;
  left: number;   // 0..100 (vw)
  delay: number;  // s
  duration: number; // s
  size: number;
  rotate: number;
  color: string;
}

/**
 * Confettis hexagonaux qui tombent depuis le haut. ~16 pièces, 1.5 s.
 * Désactivé sous prefers-reduced-motion.
 */
export function HexConfetti({ count = 16 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const arr: Piece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.4 + Math.random() * 0.6,
      size: 10 + Math.random() * 10,
      rotate: Math.random() * 360,
      color: COLORS[i % COLORS.length],
    }));
    setPieces(arr);
  }, [count]);

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti absolute top-[-40px]"
          style={{
            left: `${p.left}%`,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <svg width={p.size} height={p.size * 64 / 56} viewBox="0 0 56 64">
            <path d="M28 2 52 16v32L28 62 4 48V16Z" fill={p.color} />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
