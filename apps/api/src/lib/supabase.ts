import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

const getEnv = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
};

export const getSupabase = (): SupabaseClient | null => {
  const env = getEnv();
  if (!env) return null;
  client ??= createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
};
