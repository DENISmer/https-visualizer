import { createPortal } from "react-dom";
import { useAlertsStore } from "@/shared/model/alerts/alerts.store";
import styles from "./error-alerts-stack.module.scss";

export const ErrorAlertsStack = () => {
  const alerts = useAlertsStore((state) => state.alerts);

  if (alerts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className={styles.portal}
      aria-live="assertive"
      aria-relevant="additions"
    >
      <div className={styles.stack}>
        {alerts.map((alert) => (
          <div key={alert.id} className={styles.alert} role="alert">
            {alert.message}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};
