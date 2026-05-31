"use client";

import Script from "next/script";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";

/**
 * Section "Avis Google" sur la home — placée juste après "Votre projet en
 * 4 étapes".
 *
 * Affiche un widget tiers (Elfsight / Trustindex) qui se synchronise tout seul
 * avec la fiche Google de l'entreprise : note globale + carrousel d'avis qui
 * défilent. La note s'actualise automatiquement puisque le widget relit la
 * fiche Google à chaque chargement.
 *
 * ── BRANCHEMENT ───────────────────────────────────────────────────────────
 * Widget "Google Reviews" Elfsight connecté à la fiche "Groupe Climat
 * Hexagone". L'identifiant ci-dessous (ELFSIGHT_APP_ID) provient du code
 * d'intégration fourni par Elfsight :
 *   <div class="elfsight-app-XXXX" data-elfsight-app-lazy></div>
 * La note globale et les avis se synchronisent tout seuls avec Google.
 *
 * Pour changer de widget : remplace simplement l'ID ci-dessous (ou définis
 * NEXT_PUBLIC_REVIEWS_WIDGET_ID dans .env pour surcharger sans toucher au code).
 */
const ELFSIGHT_APP_ID =
  process.env.NEXT_PUBLIC_REVIEWS_WIDGET_ID ?? "e0dcf1d3-630e-4cd7-ae8d-a2ad6a36d25f";

// Lien public vers les avis Google de l'entreprise (bouton de repli).
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=Groupe+Climat+Hexagone#lkt=LocalPoiReviews";

// Note globale affichée dans le repli statique. Le widget, lui, lit la vraie
// note en direct depuis Google.
const FALLBACK_RATING = "4,9";

export function GoogleReviews() {
  const configured = ELFSIGHT_APP_ID.length > 0;

  return (
    <Section>
      <Container>
        {configured ? (
          <>
            <Script
              src="https://elfsightcdn.com/platform.js"
              strategy="afterInteractive"
            />
            <div className={`elfsight-app-${ELFSIGHT_APP_ID}`} data-elfsight-app-lazy />
          </>
        ) : (
          <FallbackSummary />
        )}
      </Container>
    </Section>
  );
}

/**
 * Repli affiché tant que le widget n'est pas configuré : carte note Google +
 * 5 étoiles + bouton vers la page d'avis. Visuellement intentionnel (pas un
 * placeholder « cassé »).
 */
function FallbackSummary() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-surface p-8 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
      <div className="flex items-center gap-5">
        <GoogleG />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-primary-800">
              {FALLBACK_RATING}
            </span>
            <Stars />
          </div>
          <p className="mt-1 text-body-sm text-text-muted">
            Note moyenne sur Google · Avis clients vérifiés
          </p>
        </div>
      </div>
      <a
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center justify-center rounded-md bg-primary-700 px-6 font-display font-semibold text-text-inverse transition hover:bg-primary-800"
      >
        Voir tous les avis Google
      </a>
    </div>
  );
}

function Stars() {
  return (
    <span aria-hidden className="flex gap-0.5 text-accent-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
