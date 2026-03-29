import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerHealthRoute } from "@/routes/health.route";
import { registerAuthorsRoute } from "@/routes/authors.route";
import { registerAnalyzeStreamRoute } from "@/routes/analyze-stream.route";

export const createApp = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  registerHealthRoute(app);
  registerAuthorsRoute(app);
  registerAnalyzeStreamRoute(app);

  return app;
};
