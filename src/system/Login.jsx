export default function Login({ onSuccess, onCancel }) {
  function handleLogin() {
    onSuccess(); // 🔥 now correctly defined
  }

  return (
    <div style={styles.wrapper}>
      {" "}
      <div style={styles.window}>
        {" "}
        <div style={styles.titleBar}>Welcome</div>
        ```
        <div style={styles.content}>
          <label>Username</label>
          <input defaultValue="Guest" style={styles.input} />

          <label>Password</label>
          <input type="password" style={styles.input} />

          <div style={styles.actions}>
            <button onClick={handleLogin}>OK</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#3a6ea5",
    animation: "fadeIn 0.6s ease",
  },

  window: {
    width: "500px",
    border: "2px solid black",
    background: "#c0c0c0",
    boxShadow: "4px 4px black",
  },

  titleBar: {
    background: "#000080",
    color: "white",
    padding: "10px",
    fontWeight: "bold",
  },

  content: {
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    height: "32px",
    border: "2px solid black",
    padding: "5px",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },

  loadingScreen: {
    height: "100vh",
    background: "black",
    color: "#00ffcc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    fontSize: "22px",
    animation: "fadeIn 0.5s ease",
  },

  loadingText: {
    animation: "blink 1s infinite",
  },
};
