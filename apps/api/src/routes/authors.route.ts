import type { FastifyInstance } from "fastify";
import { getSupabase } from "@/lib/supabase";
import { pickAuthorLinks, type AuthorLinksDto } from "@/lib/author-links";

export type AuthorDto = {
  id: string;
  name: string;
  role: string;
  links: AuthorLinksDto;
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
      .select("id, name, role, links, telegram, avatar_url")
      .order("sort_order", { ascending: true });

    if (error) {
      app.log.error(error);
      return reply.status(500).send({ error: error.message });
    }

    const body: AuthorDto[] = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      links: pickAuthorLinks(row.links, row.telegram),
      avatarUrl: row.avatar_url,
    }));

    reply.header("Cache-Control", "public, max-age=300");
    return body;
  });
};
