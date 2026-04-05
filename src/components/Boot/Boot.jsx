import { useEffect, useState } from "react";
import styles from "./Boot.module.css";

const LINES = [
  { text: "HRISHIKESH OS v2.0.26 — CYBER PORTFOLIO SYSTEM", delay: 0 },
  { text: "", delay: 400 },
  { text: "> Initializing neural interface.......... OK", delay: 600 },
  { text: "> Mounting cyber city grid............... OK", delay: 1100 },
  { text: "> Loading portfolio data................. OK", delay: 1600 },
  { text: "> Authenticating developer profile....... OK", delay: 2100 },
  { text: "> Calibrating pixel renderer............. OK", delay: 2600 },
  { text: "> All systems nominal.", delay: 3100 },
  { text: "", delay: 3400 },
  { text: "▶  PRESS START", delay: 3600, blink: true },
];

export default function Boot({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (i === LINES.length - 1) setDone(true);
      }, line.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  function handleStart() {
    if (!done) return;
    setExiting(true);
    setTimeout(onComplete, 700);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter" || e.key === " ") handleStart();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  return (
    <div
      className={`${styles.boot} ${exiting ? styles.exit : ""}`}
      onClick={handleStart}
    >
      <div className={styles.scanlines} />
      <div className={styles.terminal}>
        {visibleLines.map((line, i) => (
          <p
            key={i}
            className={`${styles.line} ${line.blink ? styles.blink : ""}`}
          >
            {line.text}
          </p>
        ))}
        {done && <p className={styles.hint}>[ PRESS ENTER / SPACE / CLICK ]</p>}
      </div>
    </div>
  );
}
