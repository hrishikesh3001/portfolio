import styles from "./Section.module.css";
export default function Experience() {
  return (
    <div className={styles.section}>
      <p className={styles.tag}>[ CORP DISTRICT ]</p>
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>Front-End Web Developer — Intern</h3>
        <p className={styles.itemSub}>Ridhan Technologies Pvt. Ltd.</p>
        <p className={styles.itemDesc}>
          Delivered a client-facing production web application for Rap Motors
          using Angular, Bootstrap, and JavaScript — full ownership from
          requirements to deployment.
        </p>
      </div>
      <div className={styles.item}>
        <h3 className={styles.itemTitle}>Cybersecurity Analyst — Intern</h3>
        <p className={styles.itemSub}>Techno Hack EduTech</p>
        <p className={styles.itemDesc}>
          Spearheaded end-to-end penetration testing engagements. Identified
          OWASP Top 10 vulnerabilities using Burp Suite, OWASP ZAP, and Nmap
          across live environments.
        </p>
      </div>
    </div>
  );
}
