import { useState, useEffect } from "react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    function handleKey(e) {
      if (!isNaN(e.key) || "+-*/.".includes(e.key)) {
        setDisplay((prev) => (prev === "0" ? e.key : prev + e.key));
      }

      if (e.key === "Enter") calculate();
      if (e.key === "Backspace") {
        setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      }

      if (e.key === "Escape") clear();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleClick(value) {
    if (display === "0") setDisplay(value);
    else setDisplay(display + value);
  }

  function clear() {
    setDisplay("0");
  }

  function calculate() {
    try {
      const result = eval(display);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  }

  function scientific(fn) {
    try {
      const num = parseFloat(display);
      let result;

      switch (fn) {
        case "sin":
          result = Math.sin(num);
          break;
        case "cos":
          result = Math.cos(num);
          break;
        case "tan":
          result = Math.tan(num);
          break;
        case "sqrt":
          result = Math.sqrt(num);
          break;
        case "log":
          result = Math.log10(num);
          break;
        default:
          return;
      }

      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  }

  const btn = (val, onClick = () => handleClick(val)) => (
    <button style={styles.btn} onClick={onClick}>
      {val}
    </button>
  );

  return (
    <div style={styles.container}>
      <div style={styles.display}>{display}</div>

      <div style={styles.grid}>
        {btn("7")}
        {btn("8")}
        {btn("9")}
        {btn("/")}

        {btn("4")}
        {btn("5")}
        {btn("6")}
        {btn("*")}

        {btn("1")}
        {btn("2")}
        {btn("3")}
        {btn("-")}

        {btn("0")}
        {btn(".")}
        <button style={styles.btn} onClick={calculate}>
          =
        </button>
        {btn("+")}

        <button style={styles.btn} onClick={clear}>
          C
        </button>
        <button style={styles.btn} onClick={() => scientific("sin")}>
          sin
        </button>
        <button style={styles.btn} onClick={() => scientific("cos")}>
          cos
        </button>
        <button style={styles.btn} onClick={() => scientific("tan")}>
          tan
        </button>

        <button style={styles.btn} onClick={() => scientific("sqrt")}>
          √
        </button>
        <button style={styles.btn} onClick={() => scientific("log")}>
          log
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 10,
    width: "100%",
  },
  display: {
    height: 50,
    background: "black",
    color: "lime",
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 5,
  },
  btn: {
    padding: 12,
    fontSize: 14,
    cursor: "pointer",
  },
};
