import pino from "pino";
import { env } from "./env";

// Plain JSON output (no pino-pretty transport): the worker_threads-based
// transport doesn't survive Next.js' webpack bundling and crashes the
// route handler. Pipe through `pino-pretty` from the shell if you want
// colorised dev logs (e.g. `pnpm dev | pino-pretty`).
export const logger = pino({ level: env.logLevel });
