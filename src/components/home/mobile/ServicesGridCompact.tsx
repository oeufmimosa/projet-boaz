import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TricolorAccent } from "@/components/brand/TricolorBar";
import { HexIcon } from "@/components/brand/HexIcon";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Grille compacte mobile des 6 services réels du catalogue.
 * Reçoit la liste depuis la home (qui la construit à partir de SERVICES_LIST).
 */
const ICONS: Record<string, IconName> = {
  "panneau-photovoltaique": "sun",
  "pompe-a-chaleur": "flame",
  "pompe-a-chaleur-air-eau": "flame",
  "pompe-a-chaleur-air-air": "snowflake",
  "isolation-thermique-exterieure": "brick",
  "chauffe-eau-solaire-individuel": "drop",
  "ballon-thermodynamique": "tank",
  "systeme-solaire-combine": "sun",
};

export function ServicesGridCompact({
  services,
}: {
  services: { slug: string; title: string }[];
}) {
  return (
    <section className="bg-bg py-10">
      <Container>
        <h2 className="text-display-md font-display">Nos services</h2>
        <TricolorAccent className="mt-2" />

        <ul className="mt-6 grid grid-cols-2 gap-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="flex h-full items-center gap-3 rounded-md border border-border bg-surface p-3"
              >
                <HexIcon tone="soft" size="sm">
                  <Icon name={ICONS[s.slug] ?? "house"} className="h-4 w-4" />
                </HexIcon>
                <p className="flex-1 text-body-sm font-semibold leading-tight">{s.title}</p>
                <span aria-hidden className="text-primary-700">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/services"
          className="mt-4 inline-flex font-semibold text-primary-700 hover:text-primary-600"
        >
          Voir tous les services →
        </Link>
      </Container>
    </section>
  );
}
