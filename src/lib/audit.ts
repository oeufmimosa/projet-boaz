import { prisma } from "./prisma";
import { logger } from "./logger";

type AuditAction = "draft_set" | "publish" | "discard" | "upload" | "delete";

/**
 * Insère une entrée dans AuditLog. Best-effort : ne lance pas si la table
 * n'a pas encore les nouveaux champs (le client Prisma peut ne pas être
 * regénéré sur Windows à cause du verrouillage du dev server).
 */
export async function audit(args: {
  adminEmail: string;
  action: AuditAction;
  key?: string | null;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  try {
    const tm = (prisma as unknown as {
      auditLog: { create: (a: unknown) => Promise<unknown> };
    }).auditLog;
    if (!tm) return;
    await tm.create({
      data: {
        adminEmail: args.adminEmail,
        action: args.action,
        key: args.key ?? null,
        before: args.before === undefined ? null : JSON.stringify(args.before),
        after:  args.after  === undefined ? null : JSON.stringify(args.after),
      },
    });
  } catch (err) {
    logger.warn({ err }, "Audit log write failed (non-blocking)");
  }
}
