"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  sources: {
    mp4: string;
    webm?: string;
  };
  /** Image affichée tant que la vidéo n'a pas chargé, et dans tous les cas
   *  où on ne joue pas la vidéo (reduced-motion, saveData). Idéalement = une
   *  frame représentative de la vidéo. */
  poster: string;
  className?: string;
};

/**
 * Vidéo de fond hero — joue **en boucle** automatiquement, muted, sans
 * interaction. Respecte les préférences utilisateur :
 *
 *   1. `prefers-reduced-motion: reduce` → poster seul, pas de lecture
 *   2. `navigator.connection.saveData` (économiseur de données) → poster seul
 *   3. `effectiveType` `2g` ou `slow-2g` → poster seul
 *   4. Sinon → lecture en boucle infinie
 *
 * Conformément aux politiques d'autoplay, la vidéo est `muted` +
 * `playsInline` + `preload="metadata"`. Pas d'attribut HTML `autoPlay` :
 * on déclenche `video.play()` en JS après les checks ci-dessus, ce qui
 * permet de respecter les préférences avant tout démarrage.
 */
export function HeroVideoBackground({
  sources,
  poster,
  className,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 2. & 3. Respect des préférences réseau (Save-Data, 2G/slow-2G)
    const conn = (navigator as unknown as { connection?: NetworkConnection }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return;

    setShouldPlay(true);
  }, []);

  useEffect(() => {
    if (!shouldPlay || !videoRef.current) return;
    const video = videoRef.current;

    const handleError = () => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[HeroVideoBackground] vidéo non lisible, poster conservé");
      }
    };

    video.addEventListener("error", handleError);

    // Lance la lecture (toujours muted + playsInline pour passer
    // les politiques autoplay des navigateurs mobiles)
    video.play().catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[HeroVideoBackground] autoplay bloqué — poster conservé", err);
      }
    });

    return () => {
      video.removeEventListener("error", handleError);
    };
  }, [shouldPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      // Pas de `controls`, pas d'`autoPlay` HTML — pilotage JS conditionnel
    >
      {sources.webm && <source src={sources.webm} type="video/webm" />}
      <source src={sources.mp4} type="video/mp4" />
    </video>
  );
}

// Type minimal pour navigator.connection (NetworkInformation)
interface NetworkConnection {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}
