import styles from "./SectionPanel.module.css";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Thesis from "@/components/sections/Thesis";
import Contact from "@/components/sections/Contact";

const SECTION_MAP = {
  hero: HeroPanel,
  education: Education,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  thesis: Thesis,
  contact: Contact,
};

function HeroPanel() {
  return (
    <div className={styles.heroPanel}>
      <h2 className={styles.heroName}>Hrishikesh Bharadwaj</h2>
      <p className={styles.heroTitle}>
        Full Stack Developer · IT Engineer · M.Sc. Student
      </p>
      <p className={styles.heroLocation}>📍 Florence, Italy</p>
      <p className={styles.heroBio}>
        Master's student in Resilient and Cyber-Physical Systems at the
        University of Florence. Practical experience in full-stack development
        and AI-driven applications. Built and deployed real-world projects.
      </p>
      <div className={styles.heroLinks}>
        <a href="mailto:hrishigaa@gmail.com" className={styles.heroLink}>
          hrishigaa@gmail.com
        </a>
        <a
          href="https://github.com/hrishikesh3001"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.heroLink}
        >
          github.com/hrishikesh3001
        </a>
      </div>
    </div>
  );
}

export default function SectionPanel({ sectionId, onClose }) {
  const Content = SECTION_MAP[sectionId];

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        // Only close if clicking the dark overlay itself, not the panel
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className={styles.content}>
          {Content ? <Content /> : <p>Section not found.</p>}
        </div>
      </div>
    </div>
  );
}
