export default function RecycleBinApp({ recycleBin, setRecycleBin, setFiles }) {
  function restore(file) {
    setFiles((prev) => [...prev, file]);
    setRecycleBin((prev) => prev.filter((f) => f.id !== file.id));
  }

  return (
    <div style={{ padding: "10px" }}>
      <h3>Recycle Bin</h3>

      {recycleBin.length === 0 && <p>Bin is empty</p>}

      {recycleBin.map((file) => (
        <div key={file.id} style={{ marginBottom: "10px" }}>
          {file.name}

          <button onClick={() => restore(file)} style={{ marginLeft: "10px" }}>
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
