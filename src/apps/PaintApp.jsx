import { useRef, useState } from "react";

export default function PaintApp() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("black");

  function getCoords(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function start(e) {
    e.stopPropagation();

    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    setDrawing(true);
  }

  function draw(e) {
    if (!drawing) return;
    e.stopPropagation();

    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoords(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function stop(e) {
    e?.stopPropagation();
    setDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div style={styles.wrapper}>
      {/* TOOLBAR */}
      <div style={styles.toolbar}>
        <button onClick={() => setColor("black")}>■ Black</button>
        <button onClick={() => setColor("red")}>■ Red</button>
        <button onClick={() => setColor("blue")}>■ Blue</button>
        <button onClick={clearCanvas}>🧹 Clear</button>
      </div>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={styles.canvas}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    userSelect: "none", // 🔥 prevents drag selecting text
  },

  toolbar: {
    display: "flex",
    gap: "8px",
    padding: "8px",
    background: "#c0c0c0",
    borderBottom: "2px solid black",
  },

  canvas: {
    border: "2px solid black",
    background: "white",
    cursor: "crosshair",
    display: "block",
  },
};
