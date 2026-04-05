import { useState } from "react";
import Window from "../components/Window";

export default function Desktop({ setMode }) {
  const [windows, setWindows] = useState([]);
  const [zIndex, setZIndex] = useState(1);

  function openWindow(type) {
    setWindows((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        minimized: false,
        z: zIndex,
      },
    ]);
    setZIndex((z) => z + 1);
  }

  function closeWindow(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function focusWindow(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, z: zIndex } : w)),
    );
    setZIndex((z) => z + 1);
  }

  function toggleMinimize(id) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    );
  }

  function renderApp(type) {
    switch (type) {
      case "welcome":
        return <div>Welcome to my OS portfolio</div>;
      case "projects":
        return <div>Projects coming soon</div>;
      default:
        return <div>App</div>;
    }
  }

  return (
    <div style={styles.desktop}>
      {/* ICONS */}
      <div style={styles.icons}>
        <button onClick={() => openWindow("welcome")}>Welcome</button>

        <button onClick={() => openWindow("projects")}>Projects</button>
      </div>

      {/* WINDOWS */}
      {windows.map(
        (win) =>
          !win.minimized && (
            <Window
              key={win.id}
              title={win.type}
              zIndex={win.z}
              onFocus={() => focusWindow(win.id)}
              onClose={() => closeWindow(win.id)}
            >
              {renderApp(win.type)}
            </Window>
          ),
      )}

      {/* TASKBAR */}
      <div style={styles.taskbar}>
        {windows.map((win) => (
          <button
            key={win.id}
            style={styles.taskButton}
            onClick={() => toggleMinimize(win.id)}
          >
            {win.type}
          </button>
        ))}

        <button onClick={() => setMode("menu")}>Shutdown</button>
      </div>
    </div>
  );
}

const styles = {
  desktop: {
    height: "100vh",
    background: "#008080",
    position: "relative",
  },
  icons: {
    display: "flex",
    gap: "10px",
    padding: "10px",
  },
  taskbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#c0c0c0",
    display: "flex",
    gap: "5px",
    padding: "5px",
  },
  taskButton: {
    padding: "5px 10px",
  },
};
