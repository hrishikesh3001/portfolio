import styles from "./Section.module.css";
const SKILLS = [
  "Python",
  "JavaScript",
  "React",
  "Vite",
  "Angular",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "Docker",
  "Linux CLI",
  "Git",
  "Penetration Testing",
  "REST APIs",
  "Bootstrap",
  "Networking",
];
export default function Skills() {
  return (
    <div className={styles.section}>
      <p className={styles.tag}>[ SKILLS LAB ]</p>
      <h2 className={styles.title}>Technical Skills</h2>
      <div className={styles.skillGrid}>
        {SKILLS.map((s) => (
          <span key={s} className={styles.skill}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
