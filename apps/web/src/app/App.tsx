import styles from "./App.module.scss";
import { StepsTimeline } from "@/modules/steps-timeline";
import { RequestInput } from "@/modules/request-input";
import { AnalyzeModeSwitcher } from "@/modules/analyze-mode-switcher";
import { AuthorsModal } from "@/modules/authors-modal/ui/authors-modal";
import { ErrorAlertsStack } from "@/modules/error-alerts";

export const App = () => {
  return (
    <div className={styles.page}>
      <ErrorAlertsStack />
      <div className={styles.visualizerContent}>
        <header className={styles.header} aria-label="Site header">
          <div className={styles.headerTop}>
            <div className={styles.brand}>
              <span className={styles.brandTitle}>
                HTTPS Request Visualizer
              </span>
              <div>
                <AuthorsModal />
              </div>
            </div>
          </div>

          <div className={styles.headerControls}>
            <RequestInput />
          </div>
        </header>

        <main
          className={styles.main}
          id="main-content"
          aria-label="Request visualization"
        >
          <div className={styles.mainContent}>
            <StepsTimeline />
          </div>

          <div className={styles.mainBottomControls}>
            <AnalyzeModeSwitcher />
          </div>
        </main>
      </div>
    </div>
  );
};
