/** Pathnames only — combine with `apiUrl` / `apiGet` from `@/shared/api/client`. */
export const API_ROUTES = {
  analyzeStream: "/api/analyze/stream",
  authors: "/api/authors",
  health: "/api/health",
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
