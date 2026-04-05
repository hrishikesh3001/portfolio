export default function Desktop({ setMode }) {
  return (
    <div style={styles.desktop}>
      <h2>Windows 95 Portfolio (Work in Progress)</h2>

      <button onClick={() => setMode("menu")}>Shutdown</button>
    </div>
  );
}

const styles = {
  desktop: {
    height: "100vh",
    background: "#008080",
    color: "white",
    padding: "20px",
  },
};
