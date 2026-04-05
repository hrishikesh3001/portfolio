import { useState } from "react";
import TitleScreen from "./components/TitleScreen/TitleScreen";
import Desktop from "./core/Desktop";

export default function App() {
  const [mode, setMode] = useState("menu");

  if (mode === "menu") {
    return <TitleScreen setMode={setMode} />;
  }

  return <Desktop setMode={setMode} />;
}
