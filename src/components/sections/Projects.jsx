import styles from "./Section.module.css";
export default function Projects() {
  return (
    <div className={styles.section}>
      <p className={styles.tag}>[ PROJECT HUB ]</p>
      <h2 className={styles.title}>Projects</h2>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>Smart News Aggregator</h3>
        <p className={styles.itemSub}>
          React · Node.js · Express · MongoDB · HuggingFace
        </p>
        <p className={styles.itemDesc}>
          Full-stack AI-powered news aggregator fetching real articles from 6
          live RSS sources, summarized using facebook/bart-large-cnn. MongoDB
          caching reduced AI response time from ~2 min to instant.
        </p>
      </div>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>Recipe Discovery Platform</h3>
        <p className={styles.itemSub}>
          React · Vite · USDA API · YouTube API · TheMealDB
        </p>
        <p className={styles.itemDesc}>
          4 live API integrations, real-time nutrition tracking, fitness
          filters, YouTube tutorial integration, and cinematic UI. Publicly
          deployed on GitHub.
        </p>
      </div>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>Malware Detection System for IoT</h3>
        <p className={styles.itemSub}>
          Python · Machine Learning · Eigenspace Transformation
        </p>
        <p className={styles.itemDesc}>
          ML-powered real-time anomaly detection for IoT traffic — end-to-end
          pipeline from ingestion and feature extraction to classification and
          reporting.
        </p>
      </div>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>Zero Trust Network Simulation</h3>
        <p className={styles.itemSub}>
          Tailscale · Docker · Identity-Aware Proxy
        </p>
        <p className={styles.itemDesc}>
          VPN-less secure network enforcing least-privilege access, identity
          verification, and network segmentation across containerized
          environments.
        </p>
      </div>
    </div>
  );
}
