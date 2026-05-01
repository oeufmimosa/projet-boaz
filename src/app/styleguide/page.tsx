import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input, Textarea, Select, FieldWrap } from "@/components/ui/Input";
import { Placeholder } from "@/components/ui/Placeholder";
import { Logo } from "@/components/brand/Logo";
import { TricolorBar, TricolorAccent } from "@/components/brand/TricolorBar";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { HexIcon, HexBullet } from "@/components/brand/HexIcon";
import { SimulatorPreview } from "./SimulatorPreview";

export const metadata = { title: "Style Guide" };

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <TricolorBar />

      <Container className="py-10 sm:py-16">
        <header className="mb-12">
          <p className="text-body-sm font-semibold uppercase tracking-widest text-primary-600">
            Référence visuelle
          </p>
          <h1 className="mt-2 text-display-xl font-display">Style Guide</h1>
          <p className="mt-3 max-w-2xl text-body-lg text-text-muted">
            Tous les tokens, composants de marque et primitives UI du
            <strong className="font-semibold"> Groupe Climat Hexagon</strong>.
            Cette page sert de référence et de QA visuelle ; elle n'est pas
            liée depuis la navigation publique.
          </p>
        </header>

        {/* ============================================================ */}
        <Block title="1. Logos">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-surface">
              <p className="text-body-sm text-text-muted mb-4">Default</p>
              <Logo variant="default" />
            </Card>
            <Card className="bg-primary-800 border-primary-700">
              <p className="text-body-sm text-primary-200 mb-4">White (sur vert foncé)</p>
              <Logo variant="white" />
            </Card>
            <Card>
              <p className="text-body-sm text-text-muted mb-4">Dark monochrome</p>
              <Logo variant="dark" />
            </Card>
          </div>
          <div className="mt-6 flex items-center gap-6 flex-wrap">
            <Logo variant="default" size={28} withWordmark={false} />
            <Logo variant="default" size={36} />
            <Logo variant="default" size={48} />
          </div>
        </Block>

        {/* ============================================================ */}
        <Block title="2. Palette">
          <PaletteRow label="Primary (vert foncé)" tokens={[50,100,200,300,400,500,600,700,800,900].map(k => ({ name: `primary-${k}`, css: `var(--color-primary-${k})` }))} />
          <PaletteRow label="Drapeau français" tokens={[
            { name: "fr-blue", css: "var(--color-fr-blue)" },
            { name: "fr-white", css: "var(--color-fr-white)", border: true },
            { name: "fr-red", css: "var(--color-fr-red)" },
          ]} />
          <PaletteRow label="Accent doré" tokens={[
            { name: "accent-500", css: "var(--color-accent-500)" },
            { name: "accent-600", css: "var(--color-accent-600)" },
          ]} />
          <PaletteRow label="Neutres" tokens={[
            { name: "bg", css: "var(--color-bg)", border: true },
            { name: "surface", css: "var(--color-surface)", border: true },
            { name: "surface-2", css: "var(--color-surface-2)", border: true },
            { name: "border", css: "var(--color-border)", border: true },
            { name: "text", css: "var(--color-text)" },
            { name: "text-muted", css: "var(--color-text-muted)" },
          ]} />
          <PaletteRow label="États" tokens={[
            { name: "success", css: "var(--color-success)" },
            { name: "warning", css: "var(--color-warning)" },
            { name: "error", css: "var(--color-error)" },
          ]} />
        </Block>

        {/* ============================================================ */}
        <Block title="3. Typographie">
          <Card className="space-y-6">
            <div>
              <p className="text-body-sm text-text-muted mb-1">display-xl · Plus Jakarta Sans 800</p>
              <p className="text-display-xl font-display">Rénover sereinement, financer simplement</p>
            </div>
            <div>
              <p className="text-body-sm text-text-muted mb-1">display-lg · h1 secondaires</p>
              <p className="text-display-lg font-display">Aides à la rénovation énergétique</p>
            </div>
            <div>
              <p className="text-body-sm text-text-muted mb-1">display-md · h2 sections</p>
              <p className="text-display-md font-display">Comment ça marche</p>
              <TricolorAccent className="mt-2" />
            </div>
            <div>
              <p className="text-body-sm text-text-muted mb-1">display-sm · h3</p>
              <p className="text-display-sm font-display">Isolation des combles</p>
            </div>
            <div>
              <p className="text-body-sm text-text-muted mb-1">body-lg · chapô</p>
              <p className="text-body-lg">
                Ce paragraphe est en body-lg. Idéal pour un sous-titre ou une introduction de section.
              </p>
            </div>
            <div>
              <p className="text-body-sm text-text-muted mb-1">body · texte courant</p>
              <p>
                Ce paragraphe est en body, la taille par défaut. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
            <div>
              <p className="text-body-sm text-text-muted mb-1">body-sm · légendes, méta</p>
              <p className="text-body-sm">Publié le 30 avril 2026 — temps de lecture 4 min</p>
            </div>
          </Card>
        </Block>

        {/* ============================================================ */}
        <Block title="4. Boutons">
          <Card>
            <p className="mb-3 text-body-sm font-semibold text-text-muted">Variants</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent doré</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="mt-4 rounded-md bg-primary-800 p-4">
              <p className="mb-3 text-body-sm font-semibold text-primary-200">Sur fond foncé</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent">Simuler mes travaux</Button>
                <Button variant="inverse">En savoir plus</Button>
              </div>
            </div>
            <p className="mt-6 mb-3 text-body-sm font-semibold text-text-muted">Tailles</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium (default)</Button>
              <Button size="lg">Large</Button>
            </div>
            <p className="mt-6 mb-3 text-body-sm font-semibold text-text-muted">États</p>
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <LinkButton href="#" variant="outline">Link as button</LinkButton>
            </div>
          </Card>
        </Block>

        {/* ============================================================ */}
        <Block title="5. Inputs">
          <Card>
            <div className="grid gap-5 md:grid-cols-2">
              <FieldWrap label="Prénom" htmlFor="sg-fn" required>
                <Input id="sg-fn" placeholder="Alice" />
              </FieldWrap>
              <FieldWrap label="Email" htmlFor="sg-mail" required hint="Nous ne partageons jamais votre adresse.">
                <Input id="sg-mail" type="email" placeholder="alice@example.com" />
              </FieldWrap>
              <FieldWrap label="Surface (m²)" htmlFor="sg-surface">
                <Input id="sg-surface" type="number" inputMode="numeric" placeholder="95" />
              </FieldWrap>
              <FieldWrap label="Type de chauffage" htmlFor="sg-heat">
                <Select id="sg-heat" defaultValue="">
                  <option value="" disabled>— Choisir —</option>
                  <option value="gaz">Gaz</option>
                  <option value="fioul">Fioul</option>
                  <option value="electrique">Électrique</option>
                </Select>
              </FieldWrap>
              <div className="md:col-span-2">
                <FieldWrap label="Message" htmlFor="sg-msg">
                  <Textarea id="sg-msg" placeholder="Décrivez votre projet…" />
                </FieldWrap>
              </div>
              <FieldWrap label="Champ en erreur" htmlFor="sg-err" error="Email invalide">
                <Input id="sg-err" aria-invalid="true" defaultValue="not-an-email" />
              </FieldWrap>
              <FieldWrap label="Champ désactivé" htmlFor="sg-dis">
                <Input id="sg-dis" disabled defaultValue="—" />
              </FieldWrap>
            </div>
          </Card>
        </Block>

        {/* ============================================================ */}
        <Block title="6. Cards">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <p className="text-body-sm font-semibold text-text-muted">Card simple</p>
              <p className="mt-2">Bordure, ombre légère, radius lg.</p>
            </Card>
            <Card hover>
              <p className="text-body-sm font-semibold text-text-muted">Card avec hover</p>
              <p className="mt-2">Survolez : translation -4 px + ombre + bordure verte.</p>
            </Card>
            <Card className="bg-primary-700 text-text-inverse border-primary-700">
              <p className="text-body-sm font-semibold text-primary-200">Card sur fond foncé</p>
              <p className="mt-2">Pour la section "Chiffres clés".</p>
            </Card>
          </div>
        </Block>

        {/* ============================================================ */}
        <Block title="7. Tricolore">
          <Card>
            <p className="mb-3 text-body-sm font-semibold text-text-muted">TricolorBar (filet horizontal)</p>
            <TricolorBar />
            <p className="mt-6 mb-3 text-body-sm font-semibold text-text-muted">TricolorAccent (sous h2)</p>
            <h2 className="text-display-md font-display">Nos engagements</h2>
            <TricolorAccent className="mt-2" />
            <p className="mt-6 mb-3 text-body-sm font-semibold text-text-muted">FrenchBadge</p>
            <div className="flex flex-wrap gap-3">
              <FrenchBadge />
              <FrenchBadge label="Made in France" />
              <span className="rounded-md bg-primary-800 p-3">
                <FrenchBadge variant="dark" />
              </span>
            </div>
          </Card>
        </Block>

        {/* ============================================================ */}
        <Block title="8. Motifs hexagonaux">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <p className="mb-4 text-body-sm font-semibold text-text-muted">HexIcon — variants</p>
              <div className="flex items-center gap-6 flex-wrap">
                <HexIcon tone="soft" size="sm"><Bolt /></HexIcon>
                <HexIcon tone="soft" size="md"><Bolt /></HexIcon>
                <HexIcon tone="soft" size="lg"><Bolt /></HexIcon>
                <HexIcon tone="solid" size="md"><Bolt /></HexIcon>
                <HexIcon tone="outline" size="md"><Bolt /></HexIcon>
              </div>
              <p className="mt-6 mb-2 text-body-sm font-semibold text-text-muted">HexBullet (puce)</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><HexBullet /> Devis gratuit en ligne</li>
                <li className="flex items-center gap-2"><HexBullet /> Artisans RGE certifiés</li>
                <li className="flex items-center gap-2"><HexBullet /> Aides cumulables vérifiées</li>
              </ul>
            </Card>
            <Card className="hex-pattern relative overflow-hidden">
              <p className="mb-2 text-body-sm font-semibold text-text-muted">Hex pattern (fond hero)</p>
              <p className="text-body">
                Cette card utilise <code>.hex-pattern</code>. Désactivé en
                mobile et sous <code>prefers-reduced-motion</code>.
              </p>
            </Card>
          </div>
        </Block>

        {/* ============================================================ */}
        <Block title="9. Placeholder">
          <div className="grid gap-6 md:grid-cols-3">
            <Placeholder label="Hero · soft" />
            <Placeholder label="Carte service" ratio="4/3" />
            <Placeholder label="Sur fond sombre" tone="dark" />
          </div>
        </Block>

        {/* ============================================================ */}
        <Block title="10. Radii & shadows">
          <Card>
            <p className="mb-3 text-body-sm font-semibold text-text-muted">Radii</p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "sm (6 px)", cls: "rounded-sm" },
                { label: "md (10 px)", cls: "rounded-md" },
                { label: "lg (16 px)", cls: "rounded-lg" },
                { label: "xl (24 px)", cls: "rounded-xl" },
              ].map((r) => (
                <div key={r.cls} className="text-center">
                  <div className={`bg-primary-100 border border-primary-300 w-20 h-20 ${r.cls}`} />
                  <p className="mt-2 text-body-sm">{r.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 mb-3 text-body-sm font-semibold text-text-muted">Shadows</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: "shadow-sm", cls: "shadow-sm" },
                { label: "shadow-md", cls: "shadow-md" },
                { label: "shadow-lg", cls: "shadow-lg" },
              ].map((s) => (
                <div key={s.cls} className={`bg-surface rounded-md p-6 ${s.cls}`}>
                  <p className="text-body-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </Block>

        {/* ============================================================ */}
        <Block title="11. Simulateur — illustrations & ChoiceCard (preview)">
          <SimulatorPreview />
        </Block>

      </Container>
      <TricolorBar />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16 sm:mb-20">
      <h2 className="text-display-md font-display mb-6">{title}</h2>
      {children}
    </section>
  );
}

function PaletteRow({
  label,
  tokens,
}: {
  label: string;
  tokens: { name: string; css: string; border?: boolean }[];
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-body-sm font-semibold text-text-muted">{label}</p>
      <div className="flex flex-wrap gap-3">
        {tokens.map((t) => (
          <div key={t.name} className="text-center">
            <div
              className={`w-20 h-16 rounded-md ${t.border ? "border border-border" : ""}`}
              style={{ background: t.css }}
              aria-hidden
            />
            <p className="mt-1 font-mono text-[0.7rem] text-text-muted">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Petite icône utilisée dans la démo HexIcon. */
function Bolt() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
