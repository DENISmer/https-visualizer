import styles from "./App.module.scss";

export const App = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brand}>
            <div className={styles.brandIcon} />
            <span className={styles.brandTitle}>HTTPS Request Visualizer</span>
          </div>
        </div>

        <div className={styles.headerControls}>
          <input
            className={styles.urlInput}
            type="text"
            placeholder="https://example.com"
          />
          <button className={styles.analyzeButton} type="button">
            Analyze
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainInner}>Visualization scene</div>
      </main>
    </div>
  );
};
