import { API_ROUTES } from "@/shared/constants/api";

export { API_ROUTES };

/** Normalized API origin (no trailing slash). */
export const getApiBaseUrl = (): string => {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Add apps/web/.env.development or .env.production (see .env.example).",
    );
  }
  return raw.replace(/\/$/, "");
};

/** Full URL for an API path (path must start with /). */
export const apiUrl = (path: string): string => {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
};

export class ApiHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = "ApiHttpError";
  }
}

export const apiGet = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const res = await fetch(apiUrl(path), {
    ...init,
    method: "GET",
    headers,
  });

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    throw new ApiHttpError(res.status, body);
  }

  return body as T;
};

export const apiPost = async <TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<TResponse> => {
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(apiUrl(path), {
    ...init,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  let parsed: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    throw new ApiHttpError(res.status, parsed);
  }

  return parsed as TResponse;
};
