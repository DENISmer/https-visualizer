export const API_PREFIX = "/api";

export const API_ROUTES = {
  health: `${API_PREFIX}/health`,
  analyzeStream: `${API_PREFIX}/analyze/stream`,
} as const;
