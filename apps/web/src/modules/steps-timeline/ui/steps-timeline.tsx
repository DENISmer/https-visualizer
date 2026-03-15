import { usePlaybackStore } from "@/shared/model/playback/playback.store";
import styles from "./steps-timeline.module.scss";

export const StepsTimeline = () => {
  const currentStep = usePlaybackStore((state) => state.currentStep);

  if (!currentStep) return null;

  return (
    <div className={styles.root}>
      <div className={styles.step}>
        <div className={styles.dot} />
        <div className={styles.content}>
          <div className={styles.title}>{currentStep.type}</div>
        </div>
      </div>
    </div>
  );
};
