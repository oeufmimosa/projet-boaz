import nodemailer, { Transporter } from "nodemailer";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "./env";
import { logger } from "./logger";

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

function answersTable(answers: Record<string, unknown>): string {
  const rows = Object.entries(answers)
    .map(
      ([k, v]) => `
        <tr>
          <th align="left" style="padding:8px;border:1px solid #ddd;background:#f5f5f5;">${escape(k)}</th>
          <td style="padding:8px;border:1px solid #ddd;">${escape(Array.isArray(v) ? v.join(", ") : v)}</td>
        </tr>`,
    )
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
    ${answersTable(quote.answers)}
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
