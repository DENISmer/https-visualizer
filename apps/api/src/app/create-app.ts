import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerHealthRoute } from "@/routes/health.route";
import { registerAuthorsRoute } from "@/routes/authors.route";
import { registerAnalyzeStreamRoute } from "@/routes/analyze-stream.route";

const parseAllowedOrigins = (): string[] | null => {
  const raw = process.env.CORS_ALLOWED_ORIGINS?.trim();
  if (!raw) return null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const defaultProdOrigins = (): string[] => [
  "https://httpsvisualizer.org",
  "https://www.httpsvisualizer.org",
];

/**
 * CORS: nginx не заменяет настройку здесь — браузер смотрит на ответ API.
 * Один домен (сайт + /api) = обычно без cross-origin, но список нужен для
 * dev (Vite), GitHub Pages и т.п.
 */
const buildCorsOriginOption = (): boolean | string[] | ((o: string | undefined, cb: (e: Error | null, v: boolean) => void) => void) => {
  const fromEnv = parseAllowedOrigins();
  if (fromEnv?.length) {
    const allowed = new Set(fromEnv);
    return (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      cb(null, allowed.has(origin));
    };
  }

  if (process.env.NODE_ENV === "production") {
    const allowed = new Set(defaultProdOrigins());
    return (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      cb(null, allowed.has(origin));
    };
  }

  return true;
};

export const createApp = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: buildCorsOriginOption(),
  });

  registerHealthRoute(app);
  registerAuthorsRoute(app);
  registerAnalyzeStreamRoute(app);

  return app;
};
