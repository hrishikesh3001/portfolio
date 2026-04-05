import { useState } from "react";
import Boot from "@/components/Boot/Boot";
import TitleScreen from "@/components/TitleScreen/TitleScreen";
import Game from "@/components/Game/Game";
import "./styles/globals.css";

export default function App() {
  const [screen, setScreen] = useState("boot");

  return (
    <div className="app">
      {screen === "boot" && <Boot onComplete={() => setScreen("title")} />}
      {screen === "title" && <TitleScreen onPlay={() => setScreen("game")} />}
      {screen === "game" && <Game />}
    </div>
  );
}
