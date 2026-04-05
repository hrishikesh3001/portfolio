import styles from "./Section.module.css";
export default function Thesis() {
  return (
    <div className={styles.section}>
      <p className={styles.tag}>[ RESEARCH WING ]</p>
      <h2 className={styles.title}>Thesis</h2>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>
          Robust Malware Detection for IoT Devices
        </h3>
        <p className={styles.itemSub}>Deep Eigenspace Learning</p>
        <p className={styles.itemDesc}>
          Engineered an ML pipeline using eigenspace transformation to detect
          malware patterns in IoT network traffic in real time. Covers data
          ingestion, feature extraction, anomaly classification, and structured
          reporting.
        </p>
      </div>
    </div>
  );
}
