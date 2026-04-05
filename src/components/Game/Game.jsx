import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Game.module.css";
import { render } from "./engine/renderer";
import { createPlayer, updatePlayer, findPath } from "./engine/player";
import { getNearbyZone } from "./engine/zones";
import { TILE_SIZE } from "./data/mapData";
import SectionPanel from "@/components/SectionPanel/SectionPanel";

export default function Game() {
  const canvasRef = useRef(null);
  const playerRef = useRef(createPlayer());
  const keysRef = useRef({});
  const rafRef = useRef(null);
  const panelOpenRef = useRef(false);
  const nearbyZoneRef = useRef(null);
  const lastInteractRef = useRef(0); // timestamp guard — prevents re-open loop

  const [nearbyZone, setNearbyZone] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  const openPanel = useCallback((zone) => {
    if (!zone) return;
    const now = Date.now();
    // Ignore if opened less than 400ms ago — prevents double-fire
    if (now - lastInteractRef.current < 400) return;
    lastInteractRef.current = now;
    panelOpenRef.current = true;
    setActivePanel(zone.id);
  }, []);

  const closePanel = useCallback(() => {
    // Timestamp guard — prevents immediate reopen
    lastInteractRef.current = Date.now();
    panelOpenRef.current = false;
    playerRef.current.path = [];
    setActivePanel(null);
    setNearbyZone(null);
    nearbyZoneRef.current = null;
  }, []);

  // Canvas click/tap → pathfind
  function handleCanvasPointer(e) {
    e.preventDefault();
    if (panelOpenRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.touches ? e.changedTouches[0].clientY : e.clientY;
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    const player = playerRef.current;
    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;
    const worldX = screenX + camX;
    const worldY = screenY + camY;
    const tileCol = Math.floor(worldX / TILE_SIZE);
    const tileRow = Math.floor(worldY / TILE_SIZE);

    const path = findPath(player.x, player.y, tileCol, tileRow);
    player.path = path;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onKeyDown(e) {
      // Don't process game keys while panel is open
      if (panelOpenRef.current) return;

      keysRef.current[e.key] = true;

      if (e.key === "e" || e.key === "E") {
        const zone = nearbyZoneRef.current;
        if (zone) openPanel(zone);
      }
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    }

    function onKeyUp(e) {
      keysRef.current[e.key] = false;
    }

    // ESC handled separately — works even when panel is open
    function onEsc(e) {
      if (e.key === "Escape" && panelOpenRef.current) {
        closePanel();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onEsc);

    function loop() {
      if (!panelOpenRef.current) {
        updatePlayer(playerRef.current, keysRef.current);
        const zone = getNearbyZone(playerRef.current.x, playerRef.current.y);
        nearbyZoneRef.current = zone;
        setNearbyZone(zone);
      }

      render(
        ctx,
        canvas,
        playerRef.current,
        panelOpenRef.current ? null : nearbyZoneRef.current,
        playerRef.current.path,
      );

      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onEsc);
    };
  }, [openPanel, closePanel]);

  return (
    <div className={styles.game}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleCanvasPointer}
        onTouchEnd={handleCanvasPointer}
      />

      {activePanel && (
        <SectionPanel sectionId={activePanel} onClose={closePanel} />
      )}

      <div className={styles.controls}>
        <span>WASD / ↑↓←→ move</span>
        <span className={styles.divider}>·</span>
        <span>E interact</span>
        <span className={styles.divider}>·</span>
        <span>ESC close</span>
      </div>

      <div className={styles.mobileHint}>
        Tap to move · Tap near terminal to interact
      </div>
    </div>
  );
}
