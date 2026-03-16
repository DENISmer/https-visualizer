export const ANALYZE_MODES = {
  real: "real",
  slowed: "slowed",
  verySlowed: "very_slowed",
} as const;

export type AnalyzeMode = (typeof ANALYZE_MODES)[keyof typeof ANALYZE_MODES];
