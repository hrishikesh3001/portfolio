import { Rnd } from "react-rnd";

export default function Window({ title, children, onClose, onFocus, zIndex }) {
  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      }}
      bounds="window"
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <div style={styles.window}>
        <div style={styles.titleBar}>
          <span>{title}</span>

          <button style={styles.close} onClick={onClose}>
            X
          </button>
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
  },
  titleBar: {
    background: "#000080",
    color: "white",
    padding: "5px",
    display: "flex",
    justifyContent: "space-between",
    cursor: "move",
  },
  close: {
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "10px",
    background: "white",
    overflow: "auto",
  },
};
