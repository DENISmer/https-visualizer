import { usePlaybackStore } from "@/shared/model/playback/playback.store";
import { PLAYBACK_STEPS } from "@/shared/constants/playback-steps";
import styles from "./steps-timeline.module.scss";

const STEP_LABELS: Record<string, string> = {
  connected: "Connect",
  url_parsed: "URL",
  dns_resolved: "DNS",
  tcp_connected: "TCP",
  tls_established: "TLS",
  http_response_received: "HTTP",
};

export const StepsTimeline = () => {
  const currentStep = usePlaybackStore((state) => state.currentStep);

  const currentIndex = currentStep
    ? PLAYBACK_STEPS.indexOf(
        currentStep.type as (typeof PLAYBACK_STEPS)[number],
      )
    : -1;

  return (
    <div className={styles.root}>
      {PLAYBACK_STEPS.map((step, index) => {
        const isActive = currentStep?.type === step;
        const isCompleted = currentIndex > index;
        const isUpcoming = currentIndex < index;

        return (
          <div key={step} className={styles.item}>
            <div
              className={[
                styles.step,
                isActive ? styles.stepActive : "",
                isCompleted ? styles.stepCompleted : "",
                isUpcoming ? styles.stepUpcoming : "",
              ].join(" ")}
            >
              <div className={styles.dot} />
              <div className={styles.content}>
                <div className={styles.title}>{STEP_LABELS[step]}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
