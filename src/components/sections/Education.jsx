import styles from "./Section.module.css";
export default function Education() {
  return (
    <div className={styles.section}>
      <p className={styles.tag}>[ NEURAL ACADEMY ]</p>
      <h2 className={styles.title}>Education</h2>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>
          M.Sc. Resilient and Cyber-Physical Systems
        </h3>
        <p className={styles.itemSub}>University of Florence, Italy</p>
        <p className={styles.itemDesc}>
          Specializing in systems resilience, IoT infrastructure, network
          security, and fault-tolerant architecture.
        </p>
      </div>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>
          B.Tech — Computer Science Engineering
        </h3>
        <p className={styles.itemSub}>
          Malla Reddy Institute of Technology, India
        </p>
        <p className={styles.itemDesc}>
          Foundation in software engineering, OOP, databases, networking, and
          web technologies. Thesis: Robust Malware Detection for IoT Devices
          using Deep Eigenspace Learning.
        </p>
      </div>
    </div>
  );
}
