import {
  ANALYZE_MODE_LABELS,
  ANALYZE_MODES,
  type AnalyzeMode,
} from "@/shared/constants/analyze-mode";
import { useAnalysisStore } from "@/shared/model/analysis/analysis.store";
import styles from "./analyze-mode-switcher.module.scss";

const MODES = [
  ANALYZE_MODES.real,
  ANALYZE_MODES.slowed,
  ANALYZE_MODES.verySlowed,
] as const;

export const AnalyzeModeSwitcher = () => {
  const mode = useAnalysisStore((state) => state.mode);
  const setMode = useAnalysisStore((state) => state.setMode);
  const isRunning = useAnalysisStore((state) => state.isRunning);

  return (
    <div className={styles.root}>
      {MODES.map((item) => {
        const isActive = item === mode;

        return (
          <button
            key={item}
            type="button"
            className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
            onClick={() => setMode(item as AnalyzeMode)}
            disabled={isRunning}
          >
            {ANALYZE_MODE_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
};
