import { useEffect, useState } from "react";

const bootLines = [
  "HRISHI OS",
  "",
  "Initializing system...",
  "Loading modules...",
  "Starting interface...",
  "",
  "Welcome",
];

export default function Boot({ waitForKey = false, onNext }) {
  const [displayed, setDisplayed] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!waitForKey && index < bootLines.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => [...prev, bootLines[index]]);
        setIndex((i) => i + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [index, waitForKey]);

  useEffect(() => {
    if (waitForKey) {
      const handler = () => onNext();
      window.addEventListener("keydown", handler);
      window.addEventListener("click", handler);

      return () => {
        window.removeEventListener("keydown", handler);
        window.removeEventListener("click", handler);
      };
    }
  }, [waitForKey, onNext]);

  return (
    <div className="boot-container">
      <div className="boot-text">
        {displayed.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        {waitForKey && (
          <div className="boot-prompt">PRESS ANY KEY TO START</div>
        )}
      </div>
    </div>
  );
}
