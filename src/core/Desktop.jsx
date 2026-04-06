import { useState, useEffect } from "react";
import Window from "../components/Window";
import { playClick } from "../system/sound";

export default function Desktop({ setMode }) {
  const [windows, setWindows] = useState([]);
  const [zIndex, setZIndex] = useState(1);
  const [startOpen, setStartOpen] = useState(false);
  const [showPrograms, setShowPrograms] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  function openWindow(type) {
    const existing = windows.find((w) => w.type === type);

    if (existing) {
      restoreWindow(existing.id);
      return;
    }

    setWindows((prev) => [
      ...prev,
      { id: Date.now(), type, minimized: false, z: zIndex },
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

  // ================= APPS =================
  function renderApp(type) {
    switch (type) {
      case "chrome":
        return (
          <div style={{ padding: "10px" }}>
            <h2>Hrishikesh Bharadwaj</h2>

            <div style={styles.card}>
              <p>
                I am a Full-Stack Developer and AI enthusiast passionate about
                building modern, interactive, and user-focused applications. I
                enjoy combining clean UI design with strong backend logic, and
                I’m currently focused on React, Node.js, and scalable system
                design.
              </p>

              <p>
                This portfolio itself is built as a simulated operating system,
                showcasing not just projects but also my ability to design
                complex interactive systems.
              </p>
            </div>
          </div>
        );

      case "notepad":
        return (
          <textarea placeholder="Start typing..." style={styles.notepad} />
        );

      case "projects":
        return (
          <div style={{ padding: "10px" }}>
            <h3>Projects</h3>

            <div style={styles.card}>
              <p>
                <strong>📰 Smart News App</strong>
              </p>
              <p>AI-powered news aggregation with real-time updates.</p>
            </div>

            <div style={styles.card}>
              <p>
                <strong>🔐 Zero Trust Network</strong>
              </p>
              <p>
                Authentication + secure backend system using modern security
                practices.
              </p>
            </div>

            <div style={styles.card}>
              <p>
                <strong>🍽 Recipe Finder</strong>
              </p>
              <p>Search-based recipe app with API integration.</p>
            </div>
          </div>
        );

      case "welcome":
        return (
          <div style={{ padding: "10px" }}>
            <h3>Welcome</h3>

            <div style={styles.card}>
              <p>This portfolio is designed as a simulated operating system.</p>

              <p>
                <strong>Built with:</strong>
              </p>
              <ul>
                <li>React</li>
                <li>JavaScript</li>
                <li>CSS</li>
                <li>React-RND (window system)</li>
              </ul>

              <p>
                Explore apps, interact with windows, and experience a nostalgic
                OS-style interface.
              </p>
            </div>
          </div>
        );

      default:
        return <div>App</div>;
    }
  }

  // ================= UI =================
  return (
    <div
      className="os-root"
      style={styles.desktop}
      onClick={() => {
        setStartOpen(false);
        setShowPrograms(false);
      }}
    >
      {/* ICONS */}
      <div style={styles.icons}>
        {[
          { type: "chrome", label: "Chrome", icon: "/icons/computer.png" },
          { type: "notepad", label: "Notepad", icon: "/icons/notepad.png" },
          { type: "projects", label: "Projects", icon: "/icons/folder.png" },
          { type: "welcome", label: "Welcome", icon: "/icons/welcome.png" },
        ].map((item) => (
          <div
            key={item.type}
            onDoubleClick={() => {
              playClick();
              openWindow(item.type);
            }}
            style={styles.icon}
          >
            <img src={item.icon} style={styles.iconImg} />
            <span>{item.label}</span>
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
              onFocus={() => restoreWindow(win.id)}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => toggleMinimize(win.id)}
            >
              {renderApp(win.type)}
            </Window>
          ),
      )}

      {showShutdown && (
        <Window
          title="Shutdown"
          onClose={() => setShowShutdown(false)}
          onMinimize={() => {}}
          onFocus={() => {}}
          zIndex={999}
        >
          <div style={styles.shutdownBox}>
            <h3>Are you sure?</h3>

            <label>
              <input type="radio" name="power" defaultChecked />
              Shutdown
            </label>

            <label>
              <input type="radio" name="power" />
              Restart
            </label>

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => {
                  setShowShutdown(false);
                  setMode("menu"); // go home
                }}
              >
                OK
              </button>

              <button onClick={() => setShowShutdown(false)}>Cancel</button>
            </div>
          </div>
        </Window>
      )}

      {/* START MENU */}
      {startOpen && (
        <div
          style={styles.startMenu}
          onClick={(e) => e.stopPropagation()} // prevent closing
        >
          {/* LEFT BLUE PANEL */}
          <div style={styles.leftPanel}>Hrishi OS</div>

          {/* RIGHT PANEL */}
          <div style={styles.rightPanel}>
            <div
              style={styles.menuItem}
              onClick={() => setShowPrograms(!showPrograms)}
            >
              Programs ▶
            </div>

            <div style={styles.menuItem} onClick={() => openWindow("projects")}>
              📁 Projects
            </div>

            {/* Divider */}
            <div style={styles.divider}></div>

            <div style={styles.menuItem} onClick={() => setShowShutdown(true)}>
              🔌 Shutdown
            </div>

            {/* PROGRAMS SUBMENU */}
            {showPrograms && (
              <div style={styles.subMenu}>
                <div onClick={() => openWindow("chrome")}>🌐 Chrome</div>
                <div onClick={() => openWindow("notepad")}>📝 Notepad</div>
                <div onClick={() => openWindow("welcome")}>💬 Welcome</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TASKBAR */}
      <div style={styles.taskbar}>
        <button
          style={styles.startBtn}
          onClick={() => setStartOpen(!startOpen)}
        >
          Start
        </button>

        {windows.map((win) => (
          <button
            key={win.id}
            style={styles.taskButton}
            onClick={() =>
              win.minimized ? restoreWindow(win.id) : toggleMinimize(win.id)
            }
          >
            {win.type}
          </button>
        ))}

        <div style={styles.clock}>{formattedTime}</div>
      </div>
    </div>
  );
}

const styles = {
  desktop: {
    height: "100vh",
    backgroundImage: "url('/wallpaper.jpg')",
    backgroundSize: "cover",
    position: "relative",
  },

  icons: {
    position: "absolute",
    top: 15,
    left: 10,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  icon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    color: "white",
    width: "80px",
    fontSize: "12px",
  },

  iconImg: { width: "48px", height: "48px" },

  card: {
    border: "2px inset white",
    padding: "10px",
    marginTop: "10px",
    background: "#fff",
  },

  notepad: {
    width: "100%",
    height: "100%",
    color: "black",
    background: "white",
    border: "none",
    outline: "none",
  },

  taskbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "#c0c0c0",
    display: "flex",
    padding: "4px",
  },

  startBtn: {
    background: "#2a5bd7",
    color: "white",
    padding: "4px 12px",
  },

  taskButton: {
    marginLeft: "5px",
  },

  clock: {
    marginLeft: "auto",
    padding: "0 10px",
  },

  startMenu: {
    position: "absolute",
    bottom: "40px",
    left: "5px",
    width: "360px",
    display: "flex",
    border: "3px solid black",
    fontSize: "14px",
  },

  leftPanel: {
    width: "30%",
    background: "#245edc",
    color: "white",
    padding: "20px 10px",
    fontWeight: "bold",
  },

  rightPanel: {
    width: "70%",
    background: "#c0c0c0",
    padding: "10px",
    position: "relative",
  },

  menuItem: {
    padding: "10px",
    cursor: "pointer",
    marginBottom: "5px",
  },

  divider: {
    height: "2px",
    background: "#888",
    marginBottom: "10px 0",
  },

  subMenu: {
    position: "absolute",
    left: "100%",
    top: 0,
    background: "#c0c0c0",
    border: "2px solid black",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  shutdownBox: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};
