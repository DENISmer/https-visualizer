export const ANALYZE_MODES = {
  real: "real",
  slowed: "slowed",
  verySlowed: "very_slowed",
} as const;

export type AnalyzeMode = (typeof ANALYZE_MODES)[keyof typeof ANALYZE_MODES];

export const ANALYZE_MODE_LABELS: Record<AnalyzeMode, string> = {
  real: "Real",
  slowed: "Visual",
  very_slowed: "Slow",
};
