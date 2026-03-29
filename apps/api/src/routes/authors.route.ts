import type { FastifyInstance } from "fastify";
import { getSupabase } from "@/lib/supabase";

export type AuthorDto = {
  id: string;
  name: string;
  role: string;
  telegram: string;
  avatarUrl: string | null;
};

export const registerAuthorsRoute = (app: FastifyInstance) => {
  app.get("/api/authors", async (_req, reply) => {
    const supabase = getSupabase();
    if (!supabase) {
      return reply.status(503).send({ error: "Supabase not configured" });
    }

    const { data, error } = await supabase
      .from("authors")
      .select("id, name, role, telegram, avatar_url")
      .order("sort_order", { ascending: true });

    if (error) {
      app.log.error(error);
      return reply.status(500).send({ error: error.message });
    }

    const body: AuthorDto[] = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      telegram: row.telegram,
      avatarUrl: row.avatar_url,
    }));

    reply.header("Cache-Control", "public, max-age=300");
    return body;
  });
};
