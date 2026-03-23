import { useLayoutEffect, useRef, useState } from "react";
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
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  const activeIndex = MODES.indexOf(mode);

  useLayoutEffect(() => {
    const el = buttonRefs.current[activeIndex];
    if (el) {
      setSlider({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeIndex]);

  return (
    <div className={styles.root}>
      <div
        className={styles.slider}
        style={{
          transform: `translateX(${slider.left}px)`,
          width: slider.width || undefined,
        }}
      />
      {MODES.map((item, index) => {
        const isActive = item === mode;

        return (
          <button
            key={item}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
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
