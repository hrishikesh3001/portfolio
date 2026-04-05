import styles from "./TitleScreen.module.css";

export default function TitleScreen({ onPlay }) {
  return (
    <div className={styles.title}>
      <div className={styles.grid} />
      <div className={styles.cityscape} />

      <div className={styles.content}>
        <p className={styles.subtitle}>[ PORTFOLIO v2.0 ]</p>
        <h1 className={styles.name}>
          HRISHIKESH
          <br />
          .EXE
        </h1>
        <p className={styles.role}>
          Full Stack Developer · IT Engineer · M.Sc. Student
        </p>

        <div className={styles.buttons}>
          <button className={styles.playBtn} onClick={onPlay}>
            {"▶"} PLAY
          </button>
          className={styles.resumeBtn}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            {"📄"} VIEW RESUME
          </a>
        </div>

        <p className={styles.hint}>
          Use arrow keys or WASD to move · Press E to interact
        </p>
      </div>

      <div className={styles.scanlines} />
    </div>
  );
}
