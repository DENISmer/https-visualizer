import { useState } from "react";
import { useAnalysisStore } from "@/shared/model/analysis/analysis.store";
import { GlassButton } from "@/shared/ui/glass-button";
import styles from "./request-input.module.scss";

export const RequestInput = () => {
  const [url, setUrl] = useState("");
  const start = useAnalysisStore((state) => state.start);
  const isRunning = useAnalysisStore((state) => state.isRunning);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    start(url.trim());
  };

  return (
    <div className={styles.root}>
      <input
        className={styles.input}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://google.com"
      />
      <GlassButton
        className={styles.analyzeButton}
        onClick={handleAnalyze}
        disabled={isRunning}
      >
        {isRunning ? "Analyzing..." : "Analyze"}
      </GlassButton>
    </div>
  );
};
