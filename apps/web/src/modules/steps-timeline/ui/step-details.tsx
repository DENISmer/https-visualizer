import type { PlaybackStepType, StepPayloadByType } from "@/shared/types/analyze";
import styles from "./step-details.module.scss";

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((v) => formatValue(v)).join(", ");
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

type Props = {
  step: PlaybackStepType;
  payload: StepPayloadByType[PlaybackStepType] | undefined;
};

export const StepDetails = ({ step, payload }: Props) => {
  if (!payload) {
    return null;
  }

  const entries = Object.entries(payload as Record<string, unknown>).filter(
    ([, v]) => v !== undefined,
  );

  return (
    <div className={styles.root} data-step={step}>
      <dl className={styles.list}>
        {entries.map(([key, value]) => (
          <div key={key} className={styles.row}>
            <dt className={styles.key}>{formatLabel(key)}</dt>
            <dd className={styles.value}>{formatValue(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
