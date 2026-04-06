import { useState, useEffect } from "react";
import Window from "../components/Window";
import NotepadApp from "../apps/NotepadApp";
import RecycleBinApp from "../apps/RecycleBinApp";
import CalculatorApp from "../apps/CalculatorApp";
import PaintApp from "../apps/PaintApp";

export default function Desktop({ setMode }) {
  const clickSound = new Audio("/sounds/click.mp3");

  const playClick = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };

  const [weather, setWeather] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [recycleBin, setRecycleBin] = useState([]);
  const [selected, setSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [windows, setWindows] = useState([]);
  const [zIndex, setZIndex] = useState(1);
  const [startOpen, setStartOpen] = useState(false);
  const [showPrograms, setShowPrograms] = useState(false);
  const [time, setTime] = useState(new Date());

  // WEATHER
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=43.88&longitude=11.10&current_weather=true",
    )
      .then((res) => res.json())
      .then((data) => setWeather(data.current_weather))
      .catch(() => console.log("Weather failed"));
  }, []);

  // CLOCK
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString();

  function deleteFile(fileId) {
    const fileToDelete = files.find((f) => f.id === fileId);
    if (!fileToDelete) return;

    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setRecycleBin((prev) => [...prev, fileToDelete]);
  }

  function openWindow(type, fileData = null) {
    playClick();

    setWindows((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        minimized: false,
        z: zIndex,
        file: fileData,
      },
    ]);

    setZIndex((z) => z + 1);
    setStartOpen(false);
  }

  function closeWindow(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function restoreWindow(id) {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: false, z: zIndex } : w,
      ),
    );
    setZIndex((z) => z + 1);
  }

  function toggleMinimize(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    );
  }

  function renderApp(win) {
    switch (win.type) {
      case "chrome":
        return (
          <div style={{ padding: "10px" }}>
            <h2>Hrishikesh Bharadwaj</h2>

            <div style={styles.card}>
              <p>
                Full-Stack Developer specializing in modern web applications
                with a growing focus on intelligent systems and backend
                architecture, building interactive, scalable, problem-solving
                applications and exploring practical applications of AI.
              </p>

              <p>
                Skilled in React, Node.js, system design, and creating immersive
                user experiences like this OS-style portfolio.
              </p>
            </div>

            <div style={styles.card}>
              <strong>Contact</strong>
              <p>Email: hrishigaa@gmail.com</p>
              <p>
                LinkedIn:
                <a
                  href="https://www.linkedin.com/in/hrishikesh-bharadwaj-355b5b1b1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
              </p>
            </div>
          </div>
        );

      case "notepad":
        return (
          <NotepadApp
            files={files}
            setFiles={setFiles}
            initialContent={win.file?.content || ""}
          />
        );

      case "projects":
        return (
          <div style={{ padding: 20 }}>
            <h3>Projects</h3>
            <div style={styles.card}>📰 Smart News App – AI powered</div>
            <div style={styles.card}>🔐 Zero Trust Network</div>
            <div style={styles.card}>🍽 Recipe Finder</div>
          </div>
        );

      case "welcome":
        return (
          <div style={{ padding: 20 }}>
            <h3>Skills</h3>
            <div style={styles.card}>
              React • JavaScript • Node.js • APIs • System Design • UI/UX
            </div>
          </div>
        );

      case "recycle":
        return (
          <RecycleBinApp
            recycleBin={recycleBin}
            setRecycleBin={setRecycleBin}
            setFiles={setFiles}
          />
        );

      case "calc":
        return <CalculatorApp />;

      case "paint":
        return <PaintApp />;

      default:
        return <div>App</div>;
    }
  }

  return (
    <div
      style={styles.desktop}
      onClick={(e) => {
        if (!e.target.closest(".start-menu")) {
          setStartOpen(false);
          setShowPrograms(false);
        }
        setContextMenu(null);
        setSelected(null);
      }}
    >
      {/* ICONS */}
      <div style={styles.icons}>
        {[
          { type: "chrome", label: "Chrome", icon: "/icons/computer.png" },
          { type: "notepad", label: "Notepad", icon: "/icons/notepad.png" },
          { type: "projects", label: "Projects", icon: "/icons/folder.png" },
          { type: "welcome", label: "Welcome", icon: "/icons/welcome.png" },
          { type: "recycle", label: "Recycle Bin", icon: "/icons/bin.png" },
        ].map((item) => (
          <div
            key={item.type}
            onClick={() => setSelected(item.type)}
            onDoubleClick={() => openWindow(item.type)}
            style={{
              ...styles.icon,
              background:
                selected === item.type ? "rgba(0,120,215,0.4)" : "transparent",
            }}
          >
            <img src={item.icon} style={styles.iconImg} />
            <span style={{ marginTop: "4px" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* WINDOWS */}
      {windows.map(
        (win) =>
          !win.minimized && (
            <Window
              key={win.id}
              title={win.type}
              zIndex={win.z}
              default={{
                x: window.innerWidth / 2 - 300,
                y: window.innerHeight / 2 - 200,
                width: 600,
                height: 400,
              }}
              onFocus={() => restoreWindow(win.id)}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => toggleMinimize(win.id)}
            >
              {renderApp(win)}
            </Window>
          ),
      )}

      {/* START MENU */}
      {startOpen && (
        <div className="start-menu" style={styles.startMenu}>
          <div style={styles.leftPanel}>Hrishi OS</div>

          <div style={styles.rightPanel}>
            <div
              style={styles.menuItem}
              onClick={() => setShowPrograms((p) => !p)}
            >
              Programs ▶
            </div>

            {showPrograms && (
              <div style={styles.subMenu}>
                {[
                  ["Chrome", "chrome"],
                  ["Notepad", "notepad"],
                  ["Paint", "paint"],
                  ["Calculator", "calc"],
                ].map(([label, type]) => (
                  <div
                    key={type}
                    style={styles.subItem}
                    onClick={() => openWindow(type)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}

            <div style={styles.menuItem} onClick={() => openWindow("projects")}>
              📁 Projects
            </div>

            <div style={styles.divider}></div>

            <div style={styles.menuItem} onClick={() => setMode("menu")}>
              🔌 Shutdown
            </div>
          </div>
        </div>
      )}

      {/* TASKBAR */}
      <div style={styles.taskbar}>
        <button
          style={styles.startBtn}
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen((prev) => !prev);
          }}
        >
          <img src="/icons/windows.png" width="16" />
          <span style={{ fontWeight: "bold" }}> Start</span>
        </button>

        {windows.map((win) => (
          <button
            key={win.id}
            style={{
              ...styles.taskButton,
              background: win.minimized ? "#808080" : "#e0e0e0",
            }}
            onClick={() =>
              win.minimized ? restoreWindow(win.id) : toggleMinimize(win.id)
            }
          >
            {win.type}
          </button>
        ))}

        {/* RIGHT SIDE INFO */}
        <div style={styles.rightPanelInfo}>
          {/* WEATHER */}
          {weather && (
            <div style={{ marginRight: "10px" }}>
              {Math.round(weather.temperature)}°C
            </div>
          )}

          {/* DATE + TIME STACK */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span>{formattedDate}</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  desktop: {
    height: "100vh",
    backgroundImage: "url('/wallpaper.jpg')",
    backgroundSize: "cover",
  },

  icons: {
    position: "absolute",
    top: 20,
    left: 20,
    display: "grid",
    gap: 20,
  },

  icon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "80px",
    color: "white",
    textAlign: "center",
    fontSize: "12px",
    lineHeight: "14px",
  },

  iconImg: { width: 48 },

  taskbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 40,
    background: "linear-gradient(to top, #245edc, #3a6ea5)",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "0 6px",
    boxShadow: "inset 0 1px 0 #ffffff",
  },

  taskButton: {
    marginLeft: "5px",
    padding: "4px 10px",
    border: "2px outset #fff",
    cursor: "pointer",
  },

  startBtn: {
    display: "flex",
    gap: 6,
    padding: "6px 16px",
    fontSize: "16px",
    background: "linear-gradient(to bottom, #4caf50, #2e7d32)",
    color: "white",
    border: "2px outset #fff",
    fontWeight: "bold",
    color: "white",
    border: "2px outset white",
  },

  rightInfo: {
    marginLeft: "auto",
    display: "flex",
    gap: 12,
  },

  startMenu: {
    position: "absolute",
    bottom: 40,
    left: 0,
    width: 380,
    display: "flex",
    border: "3px solid black",
    background: "#c0c0c0",
  },

  leftPanel: {
    width: "30%",
    background: "#245edc",
    color: "white",
    padding: 20,
  },

  rightPanel: {
    width: "70%",
    padding: 10,
  },

  rightPanelInfo: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 10px",
    fontSize: "12px",
    color: "white",
  },

  menuItem: {
    padding: "10px",
    fontSize: "16px",
    borderBottom: "1px solid #999",
    cursor: "pointer",
  },

  subMenu: {
    marginLeft: 10,
    marginTop: 5,
    border: "1px solid #999",
  },

  subItem: {
    padding: "10px",
    borderBottom: "1px solid #aaa",
    cursor: "pointer",
  },

  divider: {
    height: 2,
    background: "#888",
    margin: "10px 0",
  },

  card: {
    border: "2px inset white",
    padding: 10,
    marginTop: 10,
    background: "#fff",
  },
};
