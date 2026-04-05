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

  const [nearbyZone, setNearbyZone] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  const openPanel = useCallback((zone) => {
    if (!zone) return;
    panelOpenRef.current = true;
    setActivePanel(zone.id);
  }, []);

  const closePanel = useCallback(() => {
    panelOpenRef.current = false;
    setActivePanel(null);
    playerRef.current.path = [];
  }, []);

  // Tap/click → pathfind
  function handleCanvasClick(e) {
    if (panelOpenRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Support both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    // Convert screen coords to world coords using camera
    const player = playerRef.current;
    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;
    const worldX = screenX + camX;
    const worldY = screenY + camY;

    const tileCol = Math.floor(worldX / TILE_SIZE);
    const tileRow = Math.floor(worldY / TILE_SIZE);

    // Run BFS
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
      keysRef.current[e.key] = true;

      if (e.key === "Escape") {
        closePanel();
        return;
      }
      if ((e.key === "e" || e.key === "E") && !panelOpenRef.current) {
        const zone = getNearbyZone(playerRef.current.x, playerRef.current.y);
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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Game loop
    function loop() {
      if (!panelOpenRef.current) {
        updatePlayer(playerRef.current, keysRef.current);
        const zone = getNearbyZone(playerRef.current.x, playerRef.current.y);
        setNearbyZone(zone);

        // Auto-open panel if player walks into zone via tap path
        if (zone && playerRef.current.path.length === 0) {
          const dist = Math.sqrt(
            Math.pow(
              playerRef.current.x - zone.tileX * TILE_SIZE - TILE_SIZE / 2,
              2,
            ) +
              Math.pow(
                playerRef.current.y - zone.tileY * TILE_SIZE - TILE_SIZE / 2,
                2,
              ),
          );
          if (dist < 20) openPanel(zone);
        }
      }

      render(
        ctx,
        canvas,
        playerRef.current,
        panelOpenRef.current ? null : nearbyZone,
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
    };
  }, [openPanel, closePanel, nearbyZone]);

  return (
    <div className={styles.game}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleCanvasClick}
        onTouchEnd={handleCanvasClick}
      />

      {activePanel && (
        <SectionPanel sectionId={activePanel} onClose={closePanel} />
      )}

      {/* Desktop hint */}
      <div className={styles.controls}>
        <span>WASD / ↑↓←→ move</span>
        <span className={styles.divider}>·</span>
        <span>E interact</span>
        <span className={styles.divider}>·</span>
        <span>ESC close</span>
      </div>

      {/* Mobile hint — only shown on touch devices */}
      <div className={styles.mobileHint}>
        Tap to move · Tap terminal to interact
      </div>
    </div>
  );
}
