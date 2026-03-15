import styles from "./App.module.scss";
import { StepsTimeline } from "@/modules/steps-timeline";
import { RequestInput } from "@/modules/request-input";

export const App = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brand}>
            <img src="/hexagon.svg" width={35} height={35} />

            <span className={styles.brandTitle}>HTTPS Request Visualizer</span>
          </div>
        </div>

        <div className={styles.headerControls}>
          <RequestInput />
        </div>
      </header>

      <main className={styles.main}>
        <StepsTimeline />
      </main>
    </div>
  );
};
