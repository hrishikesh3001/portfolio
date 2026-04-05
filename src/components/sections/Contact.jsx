import styles from "./Section.module.css";

export default function Contact() {
  return (
    <div className={styles.section}>
      <p className={styles.tag}>[ COMMS TOWER ]</p>
      <h2 className={styles.title}>Contact</h2>
      <div className={styles.item}>
        <p className={styles.itemDesc}>📧 hrishigaa@gmail.com</p>
        <p className={styles.itemDesc}>📱 +39 344 441 2849</p>
        <p className={styles.itemDesc}>📍 Florence, Italy</p>
        <p className={styles.itemDesc} style={{ marginTop: "1rem" }}>
          <a
            href="https://github.com/hrishikesh3001"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--clr-primary)" }}
          >
            github.com/hrishikesh3001
          </a>
        </p>
      </div>
    </div>
  );
}
