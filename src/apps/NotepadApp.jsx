import { useState } from "react";

export default function NotepadApp({ files, setFiles, initialContent = "" }) {
  const [text, setText] = useState(initialContent);
  const [error, setError] = useState("");

  function saveFile() {
    if (!text.trim()) {
      setError("Cannot save empty file");
      return;
    }

    const newFile = {
      id: Date.now(),
      name: `note-${files.length + 1}.txt`,
      content: text,
    };

    setFiles([...files, newFile]);
    setText("");
    setError("");
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "5px" }}>{error}</div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          fontFamily: "monospace",
        }}
      />

      <button onClick={saveFile}>💾 Save</button>
    </div>
  );
}
