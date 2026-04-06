import styles from "./TitleScreen.module.css";

export default function TitleScreen({ setMode }) {
  return (
    <div className={styles.title}>
      {/* Background layers */}
      <div className={styles.grid}></div>{" "}
      <div className={styles.cityscape}></div>{" "}
      <div className={styles.scanlines}></div>
      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.subtitle}>SYSTEM READY</div>

        <h1 className={styles.name}>HRISHIKESH</h1>

        <div className={styles.role}>FULL-STACK DEVELOPER • AI ENTHUSIAST</div>

        <div className={styles.buttons}>
          {/* RESUME */}
          <button
            className={styles.resumeBtn}
            onClick={() =>
              window.open("/resume.pdf", "_blank", "noopener,noreferrer")
            }
          >
            VIEW RESUME
          </button>

          {/* OS */}
          <button className={styles.playBtn} onClick={() => setMode()}>
            ENTER OS
          </button>
        </div>

        <div className={styles.hint}>Click ENTER OS to launch system</div>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <a href="mailto:hrishigaa@gmail.com">Email</a>
          <a href="https://linkedin.com/in/YOUR-LINK" target="_blank">
            LinkedIn
          </a>
          <a href="https://github.com/hrishikesh3001" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
