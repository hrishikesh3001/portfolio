import { useState, useEffect } from "react";
import { initSound } from "./system/sound";

import TitleScreen from "./components/TitleScreen/TitleScreen";
import Desktop from "./core/Desktop";
import Boot from "./system/Boot";
import Login from "./system/Login";

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("screen") || "menu",
  );

  useEffect(() => localStorage.setItem("screen", screen), [screen]);

  useEffect(() => {
    if (screen === "transition") {
      const timer = setTimeout(() => {
        setScreen("desktop");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [screen]);

  // 🔊 unlock sound on first interaction
  useEffect(() => {
    const unlock = () => {
      initSound();
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
  }, []);

  // ⏳ boot → wait screen
  useEffect(() => {
    if (screen === "boot") {
      const timer = setTimeout(() => {
        setScreen("boot-wait");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // ⏳ logout screen → menu
  useEffect(() => {
    if (screen === "shutdown") {
      const timer = setTimeout(() => {
        setScreen("menu");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // 🧠 ROUTING
  if (screen === "menu") {
    return <TitleScreen setMode={() => setScreen("boot")} />;
  }

  if (screen === "boot") {
    return <Boot />;
  }

  if (screen === "boot-wait") {
    return <Boot waitForKey onNext={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return (
      <Login
        onSuccess={() => setScreen("transition")}
        onCancel={() => setScreen("shutdown")}
      />
    );
  }

  if (screen === "shutdown") {
    return (
      <div style={shutdownStyles.wrapper}>
        {" "}
        <div style={shutdownStyles.text}>
          Logging out of Hrishi OS... <br />
          Please wait... <br /> <br />
          Thanks for visiting 🚀{" "}
        </div>{" "}
      </div>
    );
  }

  if (screen === "transition") {
    return <div style={transitionStyles.screen}></div>;
  }

  return <Desktop setMode={() => setScreen("menu")} />;
}

const shutdownStyles = {
  wrapper: {
    height: "100vh",
    background: "black",
    color: "#00ffcc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    fontSize: "22px",
    textAlign: "center",
  },
};

const transitionStyles = {
  screen: {
    height: "100vh",
    background: "black",
    animation: "fadeIn 0.5s ease",
  },
};
