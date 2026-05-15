import nodemailer, { Transporter } from "nodemailer";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "./env";
import { logger } from "./logger";
import {
  isIDFPostalCode,
  getRevenusThresholds,
  parseFoyerPersonnes,
  formatEuros,
} from "./anah-thresholds";

let transporterPromise: Promise<Transporter> | null = null;

async function getTransporter(): Promise<Transporter> {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    if (env.smtp.host) {
      logger.info({ host: env.smtp.host }, "Mailer: using configured SMTP");
      return nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.secure,
        auth: env.smtp.user
          ? { user: env.smtp.user, pass: env.smtp.pass }
          : undefined,
      });
    }
    if (env.isProd) {
      throw new Error("Mailer: SMTP_HOST is required in production.");
    }
    logger.warn("Mailer: no SMTP_HOST in dev, creating Ethereal test account");
    const test = await nodemailer.createTestAccount();
    logger.info({ user: test.user, web: "https://ethereal.email" }, "Ethereal account ready");
    return nodemailer.createTransport({
      host: test.smtp.host,
      port: test.smtp.port,
      secure: test.smtp.secure,
      auth: { user: test.user, pass: test.pass },
    });
  })();

  return transporterPromise;
}

async function dumpToTmp(html: string, subject: string) {
  if (env.isProd) return;
  try {
    const dir = path.resolve("tmp/mails");
    await fs.mkdir(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safe = subject.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60);
    await fs.writeFile(path.join(dir, `${stamp}_${safe}.html`), html, "utf8");
  } catch (e) {
    logger.warn({ err: e }, "Mailer: failed to dump email to tmp/");
  }
}

export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendResult {
  ok: boolean;
  error?: string;
  previewUrl?: string;
}

export async function sendMail(p: SendMailParams): Promise<SendResult> {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: env.smtp.from,
      to: p.to,
      subject: p.subject,
      html: p.html,
      text: p.text ?? stripHtml(p.html),
      replyTo: p.replyTo,
    });
    await dumpToTmp(p.html, p.subject);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) logger.info({ previewUrl }, "Mailer: Ethereal preview");
    return { ok: true, previewUrl: previewUrl || undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "Mailer: send failed");
    return { ok: false, error: message };
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function escape(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Carte des étapes du simulateur : `{ stepKey: { label, options: { value: label } } }`.
 * Permet de remplacer dans le mail les slugs techniques (`modeste`, `maison`…)
 * par les libellés humains qu'a vus l'utilisateur (`Modestes`, `Maison`…).
 */
type SimulatorStepsMap = Record<
  string,
  { label: string; options: Record<string, string> }
>;

async function loadSimulatorStepsMap(): Promise<SimulatorStepsMap> {
  // Import paresseux pour éviter d'embarquer Prisma dans tous les mailers
  // (par ex. les confirmations qui n'en ont pas besoin).
  const { prisma } = await import("./prisma");
  const steps = await prisma.simulatorStep.findMany({
    select: { key: true, label: true, options: true },
  });
  const map: SimulatorStepsMap = {};
  for (const s of steps) {
    const options: Record<string, string> = {};
    if (s.options) {
      try {
        const parsed = JSON.parse(s.options) as Array<{ value: string; label: string }>;
        if (Array.isArray(parsed)) {
          for (const opt of parsed) {
            if (opt?.value && opt?.label) options[opt.value] = opt.label;
          }
        }
      } catch {
        // options malformées → on garde la map vide pour ce step
      }
    }
    map[s.key] = { label: stripMarkdownBold(s.label), options };
  }
  return map;
}

function stripMarkdownBold(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1");
}

function resolveValue(v: unknown, optionsMap: Record<string, string>): string {
  if (Array.isArray(v)) {
    return v.map((x) => optionsMap[String(x)] ?? String(x)).join(", ");
  }
  const s = String(v ?? "");
  return optionsMap[s] ?? s;
}

/**
 * Pour l'étape "revenus", le simulateur affiche dynamiquement le seuil RFR
 * en euros calculé à partir du nombre de personnes + zone géographique.
 * On reproduit le même calcul ici pour que le mail montre exactement la
 * case que l'utilisateur a vue (« ≤ 42 933 € » plutôt que « modeste »).
 */
function resolveRevenusValue(
  value: unknown,
  answers: Record<string, unknown>,
): string | null {
  const slug = String(value ?? "");
  if (!slug) return null;
  const nbPersonnes = parseFoyerPersonnes(
    typeof answers.foyer_personnes === "string" ? answers.foyer_personnes : null,
  );
  const cp = typeof answers.code_postal === "string" ? answers.code_postal : "";
  const t = getRevenusThresholds(nbPersonnes, isIDFPostalCode(cp));
  switch (slug) {
    case "tres-modeste":  return `≤ ${formatEuros(t["tres-modeste"])}`;
    case "modeste":       return `≤ ${formatEuros(t.modeste)}`;
    case "intermediaire": return `≤ ${formatEuros(t.intermediaire)}`;
    case "superieur":     return `> ${formatEuros(t.intermediaire)}`;
    default:              return null;
  }
}

function answersTable(
  answers: Record<string, unknown>,
  steps: SimulatorStepsMap = {},
): string {
  const rows = Object.entries(answers)
    .map(([k, v]) => {
      const step = steps[k];
      const keyLabel = step?.label ?? k;
      const dynamicRevenus = k === "revenus" ? resolveRevenusValue(v, answers) : null;
      const valueLabel = dynamicRevenus ?? resolveValue(v, step?.options ?? {});
      return `
        <tr>
          <th align="left" style="padding:8px;border:1px solid #ddd;background:#f5f5f5;">${escape(keyLabel)}</th>
          <td style="padding:8px;border:1px solid #ddd;">${escape(valueLabel)}</td>
        </tr>`;
    })
    .join("");
  return `<table style="border-collapse:collapse;font-family:system-ui;font-size:14px;width:100%;">${rows}</table>`;
}

export async function sendQuoteToAdmin(quote: {
  id: string;
  answers: Record<string, unknown>;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  postalCode?: string | null;
  city?: string | null;
}): Promise<SendResult> {
  const html = `
    <h2 style="font-family:system-ui;">Nouvelle demande de simulation #${escape(quote.id)}</h2>
    <p style="font-family:system-ui;font-size:14px;">
      <strong>${escape(quote.firstName)} ${escape(quote.lastName)}</strong><br/>
      ${escape(quote.email)} — ${escape(quote.phone)}<br/>
      ${escape(quote.postalCode)} ${escape(quote.city)}
    </p>
    <h3 style="font-family:system-ui;">Réponses</h3>
    ${answersTable(quote.answers, await loadSimulatorStepsMap())}
  `;
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `Nouvelle simulation — ${quote.firstName ?? ""} ${quote.lastName ?? ""}`.trim(),
    html,
    replyTo: quote.email ?? undefined,
  });
}

export async function sendQuoteConfirmationToUser(quote: {
  email: string;
  firstName?: string | null;
}): Promise<SendResult> {
  const html = `
    <p style="font-family:system-ui;font-size:14px;">Bonjour ${escape(quote.firstName) || ""},</p>
    <p style="font-family:system-ui;font-size:14px;">
      Nous avons bien reçu votre demande de simulation. Un conseiller vous recontactera sous 24-48h.
    </p>
    <p style="font-family:system-ui;font-size:14px;">À bientôt,<br/>L'équipe ${escape(env.site.name)}</p>
  `;
  return sendMail({
    to: quote.email,
    subject: "Confirmation de votre demande",
    html,
  });
}

// ─── Newsletter ────────────────────────────────────────────────────────────

export async function sendNewsletterSignupToAdmin(email: string): Promise<SendResult> {
  const safe = escape(email);
  const html = `
    <p style="font-family:system-ui;font-size:14px;">
      <strong>${safe}</strong> s'est inscrit·e à la newsletter.
    </p>
    <p style="font-family:system-ui;font-size:12px;color:#666;">
      Reçu le ${new Date().toLocaleString("fr-FR")} via le formulaire du footer.
    </p>
  `;
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `Nouvelle inscription newsletter — ${email}`,
    html,
    replyTo: email,
  });
}

// ─── Parrainage ────────────────────────────────────────────────────────────

export interface ReferralMail {
  id: string;
  sponsorTitle?: string | null;
  sponsorLastName: string;
  sponsorFirstName: string;
  sponsorEmail: string;
  sponsorPhone?: string | null;
  refereeFirstName: string;
  refereeLastName: string;
  refereeEmail?: string | null;
  refereePhone?: string | null;
  refereePostalCode: string;
  projectType: string;
  message?: string | null;
}

const PROJECT_LABELS: Record<string, string> = {
  "panneau-photovoltaique": "Panneau photovoltaïque",
  "isolation-thermique-exterieure": "Isolation thermique extérieure (ITE)",
  "chauffe-eau-solaire-individuel": "Chauffe-eau solaire individuel (CESI)",
  "ballon-thermodynamique": "Ballon thermodynamique",
  "systeme-solaire-combine": "Système solaire combiné (SSC)",
  "pompe-a-chaleur": "Pompe à chaleur (Air-Eau / Air-Air)",
  autre: "Autre / Plusieurs travaux",
};

function projectLabel(slug: string): string {
  return PROJECT_LABELS[slug] ?? slug;
}

export async function sendReferralToAdmin(r: ReferralMail): Promise<SendResult> {
  const html = `
    <h2 style="font-family:system-ui;">Nouveau parrainage #${escape(r.id)}</h2>
    <h3 style="font-family:system-ui;margin-top:16px;">Parrain</h3>
    <p style="font-family:system-ui;font-size:14px;">
      ${escape(r.sponsorTitle ?? "")} <strong>${escape(r.sponsorFirstName)} ${escape(r.sponsorLastName)}</strong><br/>
      ${escape(r.sponsorEmail)} — ${escape(r.sponsorPhone) || "—"}
    </p>
    <h3 style="font-family:system-ui;margin-top:16px;">Filleul</h3>
    <p style="font-family:system-ui;font-size:14px;">
      <strong>${escape(r.refereeFirstName)} ${escape(r.refereeLastName)}</strong><br/>
      Email : ${escape(r.refereeEmail) || "—"}<br/>
      Téléphone : ${escape(r.refereePhone) || "—"}<br/>
      Code postal : ${escape(r.refereePostalCode)}
    </p>
    <h3 style="font-family:system-ui;margin-top:16px;">Projet</h3>
    <p style="font-family:system-ui;font-size:14px;">${escape(projectLabel(r.projectType))}</p>
    ${
      r.message
        ? `<h3 style="font-family:system-ui;margin-top:16px;">Message</h3>
           <pre style="font-family:system-ui;font-size:14px;white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;">${escape(r.message)}</pre>`
        : ""
    }
  `;
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `Parrainage — ${r.sponsorFirstName} ${r.sponsorLastName} → ${r.refereeFirstName} ${r.refereeLastName}`,
    html,
    replyTo: r.sponsorEmail,
  });
}

export async function sendReferralConfirmationToSponsor(r: ReferralMail): Promise<SendResult> {
  const html = `
    <p style="font-family:system-ui;font-size:14px;">Bonjour ${escape(r.sponsorFirstName)},</p>
    <p style="font-family:system-ui;font-size:14px;">
      Nous avons bien reçu votre parrainage pour <strong>${escape(r.refereeFirstName)} ${escape(r.refereeLastName)}</strong>.
      Notre équipe contactera votre filleul sous <strong>48 heures</strong>.
    </p>
    <p style="font-family:system-ui;font-size:14px;">
      Une fois les travaux réalisés, votre prime de <strong>jusqu'à 1 000 €</strong> vous sera versée dans un délai de 30 jours maximum.
    </p>
    <p style="font-family:system-ui;font-size:14px;">Merci pour votre confiance,<br/>L'équipe ${escape(env.site.name)}</p>
  `;
  return sendMail({
    to: r.sponsorEmail,
    subject: "Confirmation de votre parrainage",
    html,
  });
}

export async function sendReferralIntroductionToReferee(r: ReferralMail): Promise<SendResult> {
  if (!r.refereeEmail) return { ok: false, error: "no-email" };
  const html = `
    <p style="font-family:system-ui;font-size:14px;">Bonjour ${escape(r.refereeFirstName)},</p>
    <p style="font-family:system-ui;font-size:14px;">
      ${escape(r.sponsorFirstName)} ${escape(r.sponsorLastName)} nous a transmis vos coordonnées
      car vous envisagez un projet de rénovation énergétique (${escape(projectLabel(r.projectType))}).
    </p>
    <p style="font-family:system-ui;font-size:14px;">
      Nous sommes ${escape(env.site.name)}, spécialistes français de la rénovation énergétique
      (pompe à chaleur, photovoltaïque, isolation). Un conseiller prendra contact avec vous très prochainement
      pour évaluer votre projet, sans engagement.
    </p>
    <p style="font-family:system-ui;font-size:14px;">
      En attendant, vous pouvez estimer vos aides en quelques clics :<br/>
      <a href="${escape(env.site.url)}/simulateur" style="color:#1F6A40;">Démarrer une simulation gratuite</a>
    </p>
    <p style="font-family:system-ui;font-size:14px;">À très bientôt,<br/>L'équipe ${escape(env.site.name)}</p>
  `;
  return sendMail({
    to: r.refereeEmail,
    subject: `${env.site.name} — votre projet de rénovation énergétique`,
    html,
  });
}

export async function sendCallbackToAdmin(c: {
  phone: string;
  lastName: string;
  firstName: string;
  heating: string;
  email?: string | null;
}): Promise<SendResult> {
  const html = `
    <h2 style="font-family:system-ui;">Nouvelle demande de rappel</h2>
    <p style="font-family:system-ui;font-size:14px;">
      <strong>${escape(c.firstName)} ${escape(c.lastName)}</strong><br/>
      Téléphone : ${escape(c.phone)}<br/>
      Email : ${escape(c.email ?? "") || "—"}<br/>
      Mode de chauffage : ${escape(c.heating)}
    </p>
  `;
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `Rappel — ${c.firstName} ${c.lastName}`,
    html,
    replyTo: c.email || undefined,
  });
}

export async function sendContactMessage(msg: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}): Promise<SendResult> {
  const html = `
    <h2 style="font-family:system-ui;">Nouveau message de contact #${escape(msg.id)}</h2>
    <p style="font-family:system-ui;font-size:14px;">
      <strong>${escape(msg.name)}</strong> &lt;${escape(msg.email)}&gt;<br/>
      Tel : ${escape(msg.phone) || "—"}
    </p>
    <pre style="font-family:system-ui;font-size:14px;white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;">${escape(msg.message)}</pre>
  `;
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `Contact — ${msg.name}`,
    html,
    replyTo: msg.email,
  });
}
