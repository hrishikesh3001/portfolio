import { MAP, T, TILE_SIZE, MAP_COLS, MAP_ROWS, ZONES } from "../data/mapData";
import { DIRECTIONS } from "./player";

let tick = 0;

export function render(ctx, canvas, player, nearbyZone, path) {
  tick++;
  const W = canvas.width;
  const H = canvas.height;
  const camX = player.x - W / 2;
  const camY = player.y - H / 2;

  ctx.clearRect(0, 0, W, H);

  drawBackground(ctx, W, H);

  ctx.save();
  ctx.translate(-camX, -camY);

  drawTiles(ctx, camX, camY, W, H);
  drawZoneMarkers(ctx, nearbyZone);
  drawPath(ctx, path);
  drawPlayer(ctx, player);

  ctx.restore();

  if (nearbyZone) drawInteractPrompt(ctx, W, H, nearbyZone);
  drawMinimap(ctx, W, H, player);
  drawScanlines(ctx, W, H);
}

function drawBackground(ctx, W, H) {
  // Deep space gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#020408");
  grad.addColorStop(1, "#050c14");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawTiles(ctx, camX, camY, W, H) {
  const startCol = Math.max(0, Math.floor(camX / TILE_SIZE) - 1);
  const endCol = Math.min(MAP_COLS, Math.ceil((camX + W) / TILE_SIZE) + 1);
  const startRow = Math.max(0, Math.floor(camY / TILE_SIZE) - 1);
  const endRow = Math.min(MAP_ROWS, Math.ceil((camY + H) / TILE_SIZE) + 1);

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const tile = MAP[row][col];
      const px = col * TILE_SIZE;
      const py = row * TILE_SIZE;
      drawTile(ctx, tile, px, py, col, row);
    }
  }
}

function drawTile(ctx, tile, px, py, col, row) {
  const S = TILE_SIZE;

  if (tile === T.FLOOR) {
    // Base floor
    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(px, py, S, S);
    // Subtle grid line
    ctx.strokeStyle = "#0d1828";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(px, py, S, S);
    // Corner dots — sci-fi floor detail
    ctx.fillStyle = "#0f1e30";
    ctx.fillRect(px + 1, py + 1, 2, 2);
    ctx.fillRect(px + S - 3, py + 1, 2, 2);
    ctx.fillRect(px + 1, py + S - 3, 2, 2);
    ctx.fillRect(px + S - 3, py + S - 3, 2, 2);
  } else if (tile === T.WALL) {
    // Wall base — dark steel
    ctx.fillStyle = "#0c1420";
    ctx.fillRect(px, py, S, S);
    // Inner panel
    ctx.fillStyle = "#0e1a2a";
    ctx.fillRect(px + 3, py + 3, S - 6, S - 6);
    // Top/left highlight
    ctx.fillStyle = "#1a3a5c";
    ctx.fillRect(px, py, S, 2);
    ctx.fillRect(px, py, 2, S);
    // Neon edge glow — teal
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, S - 1, S - 1);
    // Corner accent
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(px, py, 4, 1);
    ctx.fillRect(px, py, 1, 4);
    ctx.fillRect(px + S - 4, py, 4, 1);
    ctx.fillRect(px + S - 1, py, 1, 4);
  } else if (tile === T.ROAD) {
    // Road base
    ctx.fillStyle = "#071018";
    ctx.fillRect(px, py, S, S);
    // Center line dashes
    if (col % 3 === 0) {
      ctx.fillStyle = "#0a2a3a";
      ctx.fillRect(px + S / 2 - 1, py + 2, 2, S - 4);
    }
    // Lane markings
    ctx.fillStyle = "#0d1e2e";
    ctx.fillRect(px, py, S, 1);
    ctx.fillRect(px, py + S - 1, S, 1);
  } else if (tile === T.BUILDING) {
    // Building exterior
    ctx.fillStyle = "#060c18";
    ctx.fillRect(px, py, S, S);
    // Structural lines
    ctx.fillStyle = "#0a1520";
    ctx.fillRect(px + S / 2 - 1, py, 2, S);
    ctx.fillRect(px, py + S / 2 - 1, S, 2);
    // Neon outline — blue
    ctx.strokeStyle = "#004d6e";
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, S - 1, S - 1);
    // Animated window flicker
    const flicker = Math.sin(tick * 0.02 + col * 1.3 + row * 0.7);
    if (flicker > 0.3) {
      ctx.fillStyle = `rgba(0, 200, 255, ${(flicker - 0.3) * 0.15})`;
      ctx.fillRect(px + 6, py + 6, 8, 6);
      ctx.fillRect(px + 18, py + 6, 8, 6);
      ctx.fillRect(px + 6, py + 18, 8, 6);
      ctx.fillRect(px + 18, py + 18, 8, 6);
    }
  } else if (tile === T.ZONE) {
    // Zone floor — slightly lighter with pulse
    ctx.fillStyle = "#0a1520";
    ctx.fillRect(px, py, S, S);
    const pulse = Math.sin(tick * 0.04 + col * 0.8 + row * 0.6) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(0, 200, 255, ${pulse * 0.08})`;
    ctx.fillRect(px, py, S, S);
    // Hex grid pattern
    ctx.strokeStyle = `rgba(0, 200, 255, ${0.06 + pulse * 0.06})`;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(px + 4, py + 4, S - 8, S - 8);
    // Corner dots
    ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + pulse * 0.4})`;
    ctx.fillRect(px + 3, py + 3, 2, 2);
    ctx.fillRect(px + S - 5, py + 3, 2, 2);
    ctx.fillRect(px + 3, py + S - 5, 2, 2);
    ctx.fillRect(px + S - 5, py + S - 5, 2, 2);
  } else if (tile === T.WATER) {
    // Water base
    ctx.fillStyle = "#020e20";
    ctx.fillRect(px, py, S, S);
    // Animated wave layers
    const w1 = Math.sin(tick * 0.03 + col * 0.5) * 0.5 + 0.5;
    const w2 = Math.sin(tick * 0.05 + row * 0.4 + 1) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(0, 80, 180, ${w1 * 0.3})`;
    ctx.fillRect(px + 2, py + 4, S - 4, 4);
    ctx.fillStyle = `rgba(0, 120, 220, ${w2 * 0.25})`;
    ctx.fillRect(px + 4, py + 14, S - 8, 4);
    ctx.fillStyle = `rgba(0, 160, 255, ${w1 * 0.2})`;
    ctx.fillRect(px + 2, py + 24, S - 4, 4);
    // Neon water edge
    ctx.strokeStyle = `rgba(0, 150, 255, 0.4)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, S - 1, S - 1);
    // Reflection glint
    if (Math.sin(tick * 0.07 + col + row) > 0.7) {
      ctx.fillStyle = "rgba(100, 200, 255, 0.15)";
      ctx.fillRect(px + 8, py + 8, 4, 2);
    }
  }
}

function drawZoneMarkers(ctx, nearbyZone) {
  ZONES.forEach((zone) => {
    const px = zone.tileX * TILE_SIZE + TILE_SIZE / 2;
    const py = zone.tileY * TILE_SIZE + TILE_SIZE / 2;
    const isNear = nearbyZone?.id === zone.id;
    const pulse = Math.sin(tick * 0.06) * 0.4 + 0.6;

    // Outer glow ring
    const ringR = isNear ? 28 : 20;
    const grd = ctx.createRadialGradient(px, py, 0, px, py, ringR);
    grd.addColorStop(0, zone.color + (isNear ? "aa" : "55"));
    grd.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(px, py, ringR * (0.8 + pulse * 0.2), 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Terminal box — pixel style
    const bw = 22,
      bh = 22;
    ctx.fillStyle = isNear ? zone.color + "33" : "#0a1520";
    ctx.fillRect(px - bw / 2, py - bh / 2, bw, bh);

    // Box border — neon
    ctx.strokeStyle = zone.color;
    ctx.lineWidth = isNear ? 2 : 1;
    ctx.strokeRect(px - bw / 2, py - bh / 2, bw, bh);

    // Corner accents
    const c = 4;
    ctx.fillStyle = zone.color;
    ctx.fillRect(px - bw / 2, py - bh / 2, c, 1);
    ctx.fillRect(px - bw / 2, py - bh / 2, 1, c);
    ctx.fillRect(px + bw / 2 - c, py - bh / 2, c, 1);
    ctx.fillRect(px + bw / 2 - 1, py - bh / 2, 1, c);
    ctx.fillRect(px - bw / 2, py + bh / 2 - 1, c, 1);
    ctx.fillRect(px - bw / 2, py + bh / 2 - c, 1, c);
    ctx.fillRect(px + bw / 2 - c, py + bh / 2 - 1, c, 1);
    ctx.fillRect(px + bw / 2 - 1, py + bh / 2 - c, 1, c);

    // E label
    ctx.fillStyle = isNear ? zone.color : zone.color + "aa";
    ctx.font = `bold ${isNear ? 12 : 10}px "Fira Code", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("E", px, py + 1);

    // Zone name — above box
    ctx.font = `${isNear ? 8 : 7}px "Fira Code", monospace`;
    ctx.fillStyle = isNear ? zone.color : zone.color + "88";
    ctx.textBaseline = "bottom";
    ctx.fillText(zone.label, px, py - bh / 2 - 5);

    // Animated scan line through box when near
    if (isNear) {
      const scanY = (tick * 0.8) % bh;
      ctx.fillStyle = zone.color + "44";
      ctx.fillRect(px - bw / 2, py - bh / 2 + scanY, bw, 2);
    }
  });
}

function drawPath(ctx, path) {
  if (!path || path.length < 2) return;
  path.forEach((tile, i) => {
    const alpha = (i / path.length) * 0.4;
    ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
    ctx.fillRect(
      tile.col * TILE_SIZE + TILE_SIZE / 2 - 2,
      tile.row * TILE_SIZE + TILE_SIZE / 2 - 2,
      4,
      4,
    );
  });
}

function drawPlayer(ctx, player) {
  const px = Math.round(player.x);
  const py = Math.round(player.y);
  const f = player.frame;
  const mv = player.moving;

  // Shadow
  ctx.fillStyle = "rgba(0, 229, 255, 0.15)";
  ctx.beginPath();
  ctx.ellipse(px, py + 11, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Each pixel block = 2×2 real pixels
  // Origin anchored at (px, py) = center-bottom of character
  const S = 2;
  function dot(ox, oy, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(px + ox * S - 12),
      Math.round(py + oy * S - 22),
      w * S,
      h * S,
    );
  }

  // ── Hair — white/silver spiky ──────────────
  dot(2, 0, 2, 1, "#c8d0d8");
  dot(5, 0, 2, 1, "#c8d0d8");
  dot(8, 0, 2, 1, "#c8d0d8");
  dot(1, 1, 3, 1, "#d8e0e8");
  dot(4, 1, 4, 1, "#d8e0e8");
  dot(8, 1, 3, 1, "#d8e0e8");

  // ── Head ──────────────────────────────────
  dot(1, 2, 10, 6, "#f0c898");

  // ── Eyes ──────────────────────────────────
  dot(2, 3, 2, 2, "#1a1a2e");
  dot(8, 3, 2, 2, "#1a1a2e");
  dot(2, 3, 1, 1, "white");
  dot(8, 3, 1, 1, "white");

  // ── Eyebrows ───────────────────────────────
  dot(2, 2, 3, 1, "#8a6040");
  dot(7, 2, 3, 1, "#8a6040");

  // ── Mouth ──────────────────────────────────
  dot(4, 6, 4, 1, "#b06848");

  // ── Neck ───────────────────────────────────
  dot(4, 8, 4, 2, "#f0c898");

  // ── Body — white/silver sci-fi suit ────────
  dot(1, 10, 10, 5, "#c8d8e8");
  // Suit details
  dot(5, 10, 2, 4, "#9ab0c8");
  dot(1, 13, 10, 1, "#7ab0d0"); // belt line
  dot(2, 10, 1, 4, "#dde8f0"); // left highlight
  dot(9, 10, 1, 4, "#9ab0c8"); // right shadow

  // ── Belt — teal glow ───────────────────────
  dot(1, 14, 10, 1, "#00e5ff");

  // ── Legs — walk animation ──────────────────
  const legColor = "#8aaac0";
  const bootColor = "#1a3a5c";

  if (!mv || f === 0 || f === 2) {
    // Neutral
    dot(2, 15, 3, 5, legColor);
    dot(7, 15, 3, 5, legColor);
    dot(1, 19, 5, 2, bootColor);
    dot(6, 19, 5, 2, bootColor);
  } else if (f === 1) {
    // Left forward
    dot(2, 15, 3, 4, legColor);
    dot(7, 15, 3, 6, legColor);
    dot(1, 18, 5, 2, bootColor);
    dot(6, 20, 5, 2, bootColor);
  } else {
    // Right forward
    dot(2, 15, 3, 6, legColor);
    dot(7, 15, 3, 4, legColor);
    dot(1, 20, 5, 2, bootColor);
    dot(6, 18, 5, 2, bootColor);
  }

  // ── Arms ──────────────────────────────────
  const armSwing = mv && (f === 1 || f === 3) ? 1 : 0;
  dot(-1, 10 + armSwing, 2, 5, "#dde8f0");
  dot(11, 10 - armSwing, 2, 5, "#9ab0c8");

  // ── Neon direction indicator ───────────────
  const dotColor = "#00e5ff";
  ctx.fillStyle = dotColor;
  ctx.shadowColor = dotColor;
  ctx.shadowBlur = 6;
  ctx.fillRect(px - 2, py - 26, 4, 4);
  ctx.shadowBlur = 0;
}

function drawInteractPrompt(ctx, W, H, zone) {
  const text = `[E]  ${zone.label}`;
  ctx.font = '600 13px "Fira Code", monospace';
  const tw = ctx.measureText(text).width;
  const pad = 16;
  const bw = tw + pad * 2;
  const bh = 36;
  const bx = (W - bw) / 2;
  const by = H - 90;

  // BG
  ctx.fillStyle = "rgba(2,8,16,0.95)";
  ctx.fillRect(bx, by, bw, bh);

  // Border
  ctx.strokeStyle = zone.color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, by, bw, bh);

  // Corner accents
  const c = 6;
  ctx.fillStyle = zone.color;
  [
    [bx, by, c, 1],
    [bx, by, 1, c],
    [bx + bw - c, by, c, 1],
    [bx + bw - 1, by, 1, c],
    [bx, by + bh - 1, c, 1],
    [bx, by + bh - c, 1, c],
    [bx + bw - c, by + bh - 1, c, 1],
    [bx + bw - 1, by + bh - c, 1, c],
  ].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));

  // Text
  ctx.fillStyle = zone.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = zone.color;
  ctx.shadowBlur = 8;
  ctx.fillText(text, W / 2, by + bh / 2);
  ctx.shadowBlur = 0;
}

function drawMinimap(ctx, W, H, player) {
  const scale = 4;
  const mmW = MAP_COLS * scale;
  const mmH = MAP_ROWS * scale;
  const mx = W - mmW - 14;
  const my = 14;

  // Panel bg
  ctx.fillStyle = "rgba(2,8,16,0.9)";
  ctx.fillRect(mx - 3, my - 3, mmW + 6, mmH + 6);
  ctx.strokeStyle = "#00e5ff44";
  ctx.lineWidth = 1;
  ctx.strokeRect(mx - 3, my - 3, mmW + 6, mmH + 6);

  // Tiles
  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      const t = MAP[row][col];
      ctx.fillStyle =
        t === T.WALL || t === T.BUILDING
          ? "#1a3a5c"
          : t === T.ROAD
            ? "#0a2030"
            : t === T.ZONE
              ? "#00e5ff22"
              : t === T.WATER
                ? "#003080"
                : "#0a1520";
      ctx.fillRect(mx + col * scale, my + row * scale, scale, scale);
    }
  }

  // Zone dots
  ZONES.forEach((z) => {
    ctx.fillStyle = z.color;
    ctx.shadowColor = z.color;
    ctx.shadowBlur = 4;
    ctx.fillRect(mx + z.tileX * scale - 1, my + z.tileY * scale - 1, 3, 3);
    ctx.shadowBlur = 0;
  });

  // Player dot
  const ppx = mx + (player.x / TILE_SIZE) * scale;
  const ppy = my + (player.y / TILE_SIZE) * scale;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(ppx, ppy, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Label
  ctx.fillStyle = "#00e5ff66";
  ctx.font = '6px "Fira Code", monospace';
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("MAP", mx, my - 10);
}

function drawScanlines(ctx, W, H) {
  // Subtle CRT scanline over entire canvas
  ctx.fillStyle = "rgba(0,0,0,0.04)";
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1);
  }
}
