export default function TitleScreen({ setMode }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hrishikesh Portfolio</h1>

      <p style={styles.subtitle}>Select an option to continue</p>

      <div style={styles.buttons}>
        <button
          style={styles.button}
          onClick={() =>
            window.open("/resume.pdf", "_blank", "noopener,noreferrer")
          }
        >
          Resume
        </button>

        <button style={styles.button} onClick={() => setMode("os")}>
          Operating System
        </button>
      </div>

      <div style={styles.links}>
        <a href="mailto:hrishigaa@gmail.com">Email</a>
        <a href="https://linkedin.com/in/YOUR-LINK" target="_blank">
          LinkedIn
        </a>
        <a href="https://github.com/hrishikesh3001" target="_blank">
          GitHub
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#0b0b1a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "monospace",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: "2rem",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "10px 20px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  links: {
    marginTop: "2rem",
    display: "flex",
    gap: "1rem",
  },
};
