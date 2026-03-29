import { getSupabase } from "@/lib/supabase";

export const extractHostnameForLog = (raw: string | undefined): string => {
  const trimmed = raw?.trim();
  if (!trimmed) return "(no-url)";
  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const host = new URL(withScheme).hostname;
    return host || "(invalid-url)";
  } catch {
    return "(invalid-url)";
  }
};

type LogAnalyzeParams = {
  requestId: string;
  ok: boolean;
  domain: string;
};

export const logAnalyzeOutcome = async ({
  requestId,
  ok,
  domain,
}: LogAnalyzeParams): Promise<void> => {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("request_logs").insert({
    request_id: requestId,
    ok,
    domain,
  });

  if (error) throw error;
};
