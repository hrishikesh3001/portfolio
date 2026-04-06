import { Rnd } from "react-rnd";

export default function Window({
  title,
  children,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
}) {
  return (
    <Rnd
      default={{ x: 120, y: 100, width: 450, height: 300 }}
      bounds="window"
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <div style={styles.window}>
        <div style={styles.titleBar}>
          <span>{title}</span>

          <div style={styles.controls}>
            <button style={styles.minBtn} onClick={onMinimize}>
              _
            </button>
            <button
              onClick={onClose}
              style={{
                background: "red",
                color: "white",
                border: "2px outset #fff",
                width: "24px",
                height: "24px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>

        <div style={styles.content}>{children}</div>
      </div>
    </Rnd>
  );
}

const styles = {
  window: {
    border: "2px solid black",
    background: "#c0c0c0",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    fontFamily: "Tahoma, sans-serif",
  },
  titleBar: {
    background: "#000080",
    color: "white",
    padding: "4px 6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "move",
  },
  controls: {
    display: "flex",
    gap: "4px",
  },
  minBtn: {
    background: "#c0c0c0",
    border: "2px outset white",
    width: "22px",
    height: "22px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  closeBtn: {
    background: "#c0c0c0",
    border: "2px outset white",
    width: "22px",
    height: "22px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    background: "white",
    padding: "10px",
    overflow: "auto",
    color: "black",
  },
};
