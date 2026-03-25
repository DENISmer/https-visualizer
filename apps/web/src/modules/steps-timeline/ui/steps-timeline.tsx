import { Fragment, useState } from "react";
import { usePlaybackStore } from "@/shared/model/playback/playback.store";
import { PLAYBACK_STEPS } from "@/shared/constants/playback-steps";
import type { PlaybackStepType } from "@/shared/types/analyze";
import { StepDetails } from "./step-details";
import { GlassButton } from "@/shared/ui/glass-button/glass-button";
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
  const [mobileOpenStep, setMobileOpenStep] = useState<PlaybackStepType | null>(
    null,
  );
  const currentStep = usePlaybackStore((state) => state.currentStep);
  const stepPayloads = usePlaybackStore((state) => state.stepPayloads);

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
        const isConnectorFilled = currentIndex > index;

        const stepColumn = 2 * index + 1;
        const payload = stepPayloads[step];
        const detailsOpenOnMobile = mobileOpenStep === step;

        return (
          <Fragment key={step}>
            <div className={styles.column}>
              <div
                className={styles.stepCell}
                style={{ gridColumn: stepColumn, gridRow: 1 }}
              >
                <div
                  className={[
                    styles.step,
                    isActive ? styles.stepActive : "",
                    isCompleted ? styles.stepCompleted : "",
                    isUpcoming ? styles.stepUpcoming : "",
                  ].join(" ")}
                >
                  <div className={styles.stepHead}>
                    <div className={styles.dot} />
                    <div className={styles.title}>{STEP_LABELS[step]}</div>
                  </div>
                  {payload ? (
                    <GlassButton
                      type="button"
                      className={styles.detailsToggle}
                      aria-expanded={detailsOpenOnMobile}
                      aria-controls={`step-details-${step}`}
                      id={`step-details-trigger-${step}`}
                      onClick={() =>
                        setMobileOpenStep((s) => (s === step ? null : step))
                      }
                    >
                      {detailsOpenOnMobile ? "Hide details" : "View details"}
                    </GlassButton>
                  ) : null}
                </div>
              </div>

              <div
                className={[
                  styles.detailsCell,
                  detailsOpenOnMobile ? styles.detailsCellOpenMobile : "",
                ].join(" ")}
                style={{ gridColumn: stepColumn, gridRow: 2 }}
                id={`step-details-${step}`}
                {...(payload
                  ? {
                      role: "region" as const,
                      "aria-labelledby": `step-details-trigger-${step}`,
                    }
                  : {})}
              >
                <StepDetails step={step} payload={payload} />
              </div>
            </div>

            {index < PLAYBACK_STEPS.length - 1 && (
              <div
                className={styles.connector}
                style={{ gridColumn: stepColumn + 1, gridRow: 1 }}
              >
                <div className={styles.connectorTrack} />
                <div
                  className={styles.connectorFill}
                  data-filled={isConnectorFilled ? "true" : "false"}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
