import Link from "next/link";
import Image from "next/image";

export type ServiceCardData = {
  slug: string;
  title: string;
  shortLabel: string;
  description: string;
  benefits: string[];
  href: string;
  image: { url: string; blurDataURL: string | null } | null;
};

/**
 * Card service interactive (utilisée sur la home — `<ServicesGridInteractive>`).
 *
 * Comportement :
 *   - Toute la card est un `<Link>` cliquable → navigation vers `service.href`
 *   - **Desktop avec souris** : au hover, overlay vert foncé fade-in 300 ms
 *     révèle description + bénéfices + CTA. Photo zoom 1.05.
 *   - **Desktop avec clavier** : focus visible déclenche le même overlay
 *     (group-focus-visible) — accessibilité conservée.
 *   - **Mobile / touch** : overlay caché (`hidden md:flex`), tap = navigation
 *     directe. Pas de pattern « tap deux fois ».
 *   - `prefers-reduced-motion` : transitions désactivées via
 *     `motion-reduce:transition-none` + `motion-reduce:transform-none`.
 */
export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={service.href}
      aria-label={`${service.title} — En savoir plus`}
      className="group relative block overflow-hidden rounded-2xl bg-primary-900 shadow-sm
                 focus:outline-none focus-visible:ring-3 focus-visible:ring-primary-300
                 focus-visible:ring-offset-2"
    >
      {/* Photo */}
      {service.image ? (
        <Image
          src={service.image.url}
          alt={service.title}
          width={1200}
          height={900}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out
                     group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:transform-none"
          {...(service.image.blurDataURL
            ? { placeholder: "blur" as const, blurDataURL: service.image.blurDataURL }
            : {})}
        />
      ) : (
        // Fallback dégradé hexagonal vert
        <div
          aria-hidden
          className="aspect-[4/3] w-full bg-gradient-to-br from-primary-700 to-primary-900"
        >
          <svg viewBox="0 0 400 300" className="h-full w-full opacity-30">
            <path
              d="M200 60 280 110v90L200 250l-80-50v-90Z"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}

      {/* Dégradé permanent en bas pour lisibilité du titre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{ background: "linear-gradient(to top, rgba(10,42,26,0.92), transparent)" }}
      />

      {/* Bandeau titre toujours visible (mobile + état repos desktop) */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <p className="mb-1 text-body-sm font-semibold uppercase tracking-wide text-accent-500">
          {service.shortLabel}
        </p>
        <h3 className="font-display text-display-sm font-bold text-white">
          {service.title}
        </h3>
      </div>

      {/* Overlay révélé au hover (desktop only) */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 hidden flex-col justify-end p-5 opacity-0
                   transition-opacity duration-300 ease-out
                   group-hover:opacity-100 group-focus-visible:opacity-100
                   md:flex sm:p-6
                   motion-reduce:transition-none"
        style={{ background: "rgba(10,42,26,0.90)" }}
      >
        {/* Petit accent tricolore */}
        <div className="mb-4 flex h-0.5 w-12">
          <div className="flex-1" style={{ background: "var(--color-fr-blue)" }} />
          <div className="flex-1" style={{ background: "var(--color-fr-white)" }} />
          <div className="flex-1" style={{ background: "var(--color-fr-red)" }} />
        </div>

        <p className="mb-1 text-body-sm font-semibold uppercase tracking-wide text-accent-500">
          {service.shortLabel}
        </p>
        <h3 className="mb-3 font-display text-display-sm font-bold text-white">
          {service.title}
        </h3>

        <p className="mb-4 text-body leading-relaxed text-white/90">
          {service.description}
        </p>

        <ul className="mb-5 space-y-2">
          {service.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-body-sm text-white/85">
              <HexBullet />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <span
          className="inline-flex items-center gap-2 text-body font-semibold text-accent-500
                     transition-all duration-200 group-hover:gap-3"
        >
          En savoir plus
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

function HexBullet() {
  return (
    <span
      aria-hidden
      className="mt-1 inline-block h-3 w-3 shrink-0 bg-accent-500"
      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
    />
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
