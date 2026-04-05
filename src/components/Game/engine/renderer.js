import { MAP, T, TILE_SIZE, MAP_COLS, MAP_ROWS, ZONES } from "../data/mapData";

let tick = 0;

export function render(ctx, canvas, player, nearbyZone, path) {
  tick++;
  const W = canvas.width;
  const H = canvas.height;
  const camX = Math.round(player.x - W / 2);
  const camY = Math.round(player.y - H / 2);

  // Sky blue background
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-camX, -camY);

  drawTiles(ctx, camX, camY, W, H);
  drawDecorations(ctx, camX, camY, W, H);
  drawZoneSigns(ctx, nearbyZone);
  drawPath(ctx, path);
  drawPlayer(ctx, player);

  ctx.restore();

  if (nearbyZone) drawPrompt(ctx, W, H, nearbyZone);
  drawMinimap(ctx, W, H, player);
}

// ── Tile drawing ─────────────────────────────────────────────────
function drawTiles(ctx, camX, camY, W, H) {
  const c0 = Math.max(0, Math.floor(camX / TILE_SIZE) - 1);
  const c1 = Math.min(MAP_COLS, Math.ceil((camX + W) / TILE_SIZE) + 1);
  const r0 = Math.max(0, Math.floor(camY / TILE_SIZE) - 1);
  const r1 = Math.min(MAP_ROWS, Math.ceil((camY + H) / TILE_SIZE) + 1);
  for (let row = r0; row < r1; row++)
    for (let col = c0; col < c1; col++)
      drawTile(ctx, MAP[row][col], col * TILE_SIZE, row * TILE_SIZE, col, row);
}

function drawTile(ctx, tile, px, py, col, row) {
  const S = TILE_SIZE;

  if (tile === T.GRASS) {
    // Bright green grass with slight variation
    const shade = (col + row) % 2 === 0 ? "#5cb85c" : "#58b558";
    ctx.fillStyle = shade;
    ctx.fillRect(px, py, S, S);
    // Grass texture dots
    ctx.fillStyle = "#4da84d";
    ctx.fillRect(px + 4, py + 6, 2, 2);
    ctx.fillRect(px + 12, py + 14, 2, 2);
    ctx.fillRect(px + 22, py + 8, 2, 2);
    ctx.fillRect(px + 8, py + 22, 2, 2);
    ctx.fillRect(px + 26, py + 20, 2, 2);
  } else if (tile === T.COBBLE) {
    // Grey cobblestone — diagonal brick pattern like reference
    const base = (col + row) % 2 === 0 ? "#9e9e9e" : "#979797";
    ctx.fillStyle = base;
    ctx.fillRect(px, py, S, S);
    // Mortar lines
    ctx.fillStyle = "#7a7a7a";
    ctx.fillRect(px, py, S, 1);
    ctx.fillRect(px, py, 1, S);
    // Inner cobble detail — offset every other row
    const offX = row % 2 === 0 ? 0 : S / 2;
    ctx.fillStyle = "#888888";
    ctx.fillRect(px + (offX % S), py + 4, S / 2 - 2, S - 8);
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(px + (offX % S) + 2, py + 5, 4, 4);
  } else if (tile === T.PATH) {
    // Lighter stone path
    ctx.fillStyle = "#c8b89a";
    ctx.fillRect(px, py, S, S);
    ctx.fillStyle = "#b8a88a";
    ctx.fillRect(px, py, S, 1);
    ctx.fillRect(px, py, 1, S);
    ctx.fillStyle = "#d8c8aa";
    ctx.fillRect(px + 3, py + 3, S - 6, S - 6);
    ctx.fillStyle = "#c0b090";
    ctx.fillRect(px + 5, py + 5, 4, 4);
    ctx.fillRect(px + 18, py + 8, 6, 3);
    ctx.fillRect(px + 8, py + 18, 3, 6);
  } else if (tile === T.WATER) {
    // Bright blue water
    const w1 = Math.sin(tick * 0.04 + col * 0.7) * 0.5 + 0.5;
    const w2 = Math.sin(tick * 0.06 + row * 0.5 + 1.5) * 0.5 + 0.5;
    ctx.fillStyle = "#3a9ad9";
    ctx.fillRect(px, py, S, S);
    // Wave layers
    ctx.fillStyle = `rgba(50,130,200,${0.3 + w1 * 0.3})`;
    ctx.fillRect(px + 2, py + 4, S - 4, 6);
    ctx.fillStyle = `rgba(80,160,220,${0.25 + w2 * 0.25})`;
    ctx.fillRect(px + 4, py + 14, S - 8, 5);
    ctx.fillStyle = `rgba(100,180,240,${0.2 + w1 * 0.2})`;
    ctx.fillRect(px + 2, py + 22, S - 4, 6);
    // Shimmer
    if (Math.sin(tick * 0.1 + col * 1.3 + row * 0.8) > 0.7) {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(px + 8, py + 6, 6, 2);
      ctx.fillRect(px + 20, py + 18, 4, 2);
    }
    // Edge highlight
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(px, py, S, 2);
  } else if (tile === T.WALL) {
    // Green hedge wall at boundary
    ctx.fillStyle = "#2d7a2d";
    ctx.fillRect(px, py, S, S);
    ctx.fillStyle = "#3a9a3a";
    ctx.fillRect(px + 2, py + 2, S - 4, S - 4);
    ctx.fillStyle = "#48b848";
    ctx.fillRect(px + 4, py + 4, 8, 8);
    ctx.fillRect(px + 18, py + 4, 8, 8);
    ctx.fillRect(px + 4, py + 18, 8, 8);
    ctx.fillRect(px + 18, py + 18, 8, 8);
    ctx.fillStyle = "#256025";
    ctx.fillRect(px, py, S, 2);
    ctx.fillRect(px, py, 2, S);
  } else if (
    tile === T.BENCH ||
    tile === T.FOUNTAIN ||
    tile === T.BUSH ||
    tile === T.TREE ||
    tile === T.LAMP
  ) {
    // Base grass under decorations
    ctx.fillStyle = "#5cb85c";
    ctx.fillRect(px, py, S, S);
  }
}

// ── Decorations (trees, bushes, benches, lamps, fountain) ────────
function drawDecorations(ctx, camX, camY, W, H) {
  const c0 = Math.max(0, Math.floor(camX / TILE_SIZE) - 2);
  const c1 = Math.min(MAP_COLS, Math.ceil((camX + W) / TILE_SIZE) + 2);
  const r0 = Math.max(0, Math.floor(camY / TILE_SIZE) - 2);
  const r1 = Math.min(MAP_ROWS, Math.ceil((camY + H) / TILE_SIZE) + 2);

  for (let row = r0; row < r1; row++) {
    for (let col = c0; col < c1; col++) {
      const tile = MAP[row][col];
      const px = col * TILE_SIZE + TILE_SIZE / 2;
      const py = row * TILE_SIZE + TILE_SIZE / 2;
      if (tile === T.TREE) drawTree(ctx, px, py);
      if (tile === T.BUSH) drawBush(ctx, px, py, col, row);
      if (tile === T.BENCH) drawBench(ctx, px, py);
      if (tile === T.LAMP) drawLamp(ctx, px, py);
      if (tile === T.FOUNTAIN) drawFountain(ctx, px, py);
    }
  }
}

function drawTree(ctx, cx, cy) {
  // Trunk
  ctx.fillStyle = "#7a5230";
  ctx.fillRect(cx - 5, cy + 2, 10, 18);
  // Root bumps
  ctx.fillStyle = "#6a4420";
  ctx.fillRect(cx - 8, cy + 14, 6, 6);
  ctx.fillRect(cx + 2, cy + 14, 6, 6);
  // Shadow under canopy
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(cx + 4, cy + 6, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  // Canopy layers — dark to bright
  ctx.fillStyle = "#1a6b1a";
  ctx.beginPath();
  ctx.arc(cx, cy - 14, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#228b22";
  ctx.beginPath();
  ctx.arc(cx - 8, cy - 10, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#228b22";
  ctx.beginPath();
  ctx.arc(cx + 10, cy - 8, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2ea02e";
  ctx.beginPath();
  ctx.arc(cx, cy - 18, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#34c234";
  ctx.beginPath();
  ctx.arc(cx - 4, cy - 22, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3ddb3d";
  ctx.beginPath();
  ctx.arc(cx + 6, cy - 20, 12, 0, Math.PI * 2);
  ctx.fill();
  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 24, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawBush(ctx, cx, cy, col, row) {
  const offset = Math.sin(col * 1.7 + row * 2.3) * 3;
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(cx + 3, cy + 6, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a7a1a";
  ctx.beginPath();
  ctx.arc(cx - 6, cy + offset, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 6, cy + offset, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#228b22";
  ctx.beginPath();
  ctx.arc(cx, cy - 2 + offset, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2eaa2e";
  ctx.beginPath();
  ctx.arc(cx - 4, cy - 4 + offset, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5, cy - 3 + offset, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#38c038";
  ctx.beginPath();
  ctx.arc(cx, cy - 6 + offset, 8, 0, Math.PI * 2);
  ctx.fill();
  // Flower dots
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(cx - 3, cy - 8 + offset, 3, 3);
  ctx.fillStyle = "#FF6B8A";
  ctx.fillRect(cx + 5, cy - 5 + offset, 3, 3);
}

function drawBench(ctx, cx, cy) {
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(cx - 18, cy + 8, 36, 6);
  // Bench legs
  ctx.fillStyle = "#5a3a10";
  ctx.fillRect(cx - 14, cy + 2, 4, 12);
  ctx.fillRect(cx + 10, cy + 2, 4, 12);
  // Bench seat — wooden planks
  ctx.fillStyle = "#c8902a";
  ctx.fillRect(cx - 16, cy - 2, 32, 6);
  ctx.fillStyle = "#d4a030";
  ctx.fillRect(cx - 16, cy - 2, 32, 2);
  ctx.fillStyle = "#b07820";
  ctx.fillRect(cx - 14, cy, 4, 4);
  ctx.fillRect(cx - 4, cy, 4, 4);
  ctx.fillRect(cx + 6, cy, 4, 4);
  // Bench back rest
  ctx.fillStyle = "#c8902a";
  ctx.fillRect(cx - 14, cy - 10, 28, 5);
  ctx.fillStyle = "#d4a030";
  ctx.fillRect(cx - 14, cy - 10, 28, 2);
  // Back legs extended
  ctx.fillStyle = "#5a3a10";
  ctx.fillRect(cx - 12, cy - 10, 3, 8);
  ctx.fillRect(cx + 9, cy - 10, 3, 8);
}

function drawLamp(ctx, cx, cy) {
  // Base
  ctx.fillStyle = "#888";
  ctx.fillRect(cx - 5, cy + 12, 10, 6);
  ctx.fillRect(cx - 8, cy + 16, 16, 4);
  // Post
  ctx.fillStyle = "#999";
  ctx.fillRect(cx - 2, cy - 20, 4, 34);
  // Lamp head
  ctx.fillStyle = "#777";
  ctx.fillRect(cx - 10, cy - 26, 20, 8);
  ctx.fillStyle = "#888";
  ctx.fillRect(cx - 8, cy - 24, 16, 6);
  // Glass — warm yellow glow
  ctx.fillStyle = "#fffaaa";
  ctx.fillRect(cx - 6, cy - 22, 12, 4);
  // Glow halo
  const glowPulse = Math.sin(tick * 0.03) * 0.1 + 0.9;
  const grd = ctx.createRadialGradient(cx, cy - 20, 0, cx, cy - 20, 28);
  grd.addColorStop(0, `rgba(255,240,150,${0.35 * glowPulse})`);
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 28, 0, Math.PI * 2);
  ctx.fill();
}

function drawFountain(ctx, cx, cy) {
  // Base pool — circular
  ctx.fillStyle = "#2980b9";
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 36, 0, Math.PI * 2);
  ctx.fill();
  // Pool rim
  ctx.strokeStyle = "#bdc3c7";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#ecf0f1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 36, 0, Math.PI * 2);
  ctx.stroke();
  // Water in pool — animated
  const w = Math.sin(tick * 0.05) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(52,152,219,${0.6 + w * 0.3})`;
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 30, 0, Math.PI * 2);
  ctx.fill();
  // Ripple rings
  const rippleR = (tick * 0.5) % 30;
  ctx.strokeStyle = `rgba(255,255,255,${0.4 * (1 - rippleR / 30)})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy + 4, rippleR, 0, Math.PI * 2);
  ctx.stroke();
  // Center pedestal
  ctx.fillStyle = "#bdc3c7";
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ecf0f1";
  ctx.beginPath();
  ctx.arc(cx, cy - 2, 6, 0, Math.PI * 2);
  ctx.fill();
  // Water spray — animated arcs
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + tick * 0.01;
    const sprayH = 18 + Math.sin(tick * 0.08 + i) * 4;
    const sprayX = Math.cos(angle) * 14;
    const sprayY = Math.sin(angle) * 8;
    ctx.strokeStyle = `rgba(100,200,255,${0.6 + Math.sin(tick * 0.1 + i) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.quadraticCurveTo(
      cx + sprayX * 0.6,
      cy - sprayH,
      cx + sprayX,
      cy + sprayY - 4,
    );
    ctx.stroke();
    // Droplet at tip
    ctx.fillStyle = "rgba(150,220,255,0.8)";
    ctx.beginPath();
    ctx.arc(cx + sprayX, cy + sprayY - 4, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Top spray
  const topH = 22 + Math.sin(tick * 0.07) * 4;
  ctx.strokeStyle = "rgba(180,230,255,0.8)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.lineTo(cx, cy - topH);
  ctx.stroke();
  ctx.fillStyle = "rgba(200,240,255,0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy - topH, 3, 0, Math.PI * 2);
  ctx.fill();
}

// ── Zone signs (billboards and boards) ───────────────────────────
function drawZoneSigns(ctx, nearbyZone) {
  ZONES.forEach((zone) => {
    const cx = zone.tileX * TILE_SIZE + TILE_SIZE / 2;
    const cy = zone.tileY * TILE_SIZE + TILE_SIZE / 2;
    const isNear = nearbyZone?.id === zone.id;
    drawWoodenSign(ctx, cx, cy, zone, isNear);
  });
}

function drawWoodenSign(ctx, cx, cy, zone, isNear) {
  const pulse = Math.sin(tick * 0.06) * 0.5 + 0.5;

  // Post
  ctx.fillStyle = "#6b4226";
  ctx.fillRect(cx - 3, cy + 2, 6, 24);
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(cx - 2, cy + 2, 2, 24);

  // Board shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(cx - 28 + 3, cy - 38 + 3, 56, 38);

  // Board background — wood
  ctx.fillStyle = "#d4a853";
  ctx.fillRect(cx - 28, cy - 38, 56, 38);
  // Wood grain
  ctx.fillStyle = "#c49040";
  ctx.fillRect(cx - 28, cy - 38 + 6, 56, 3);
  ctx.fillRect(cx - 28, cy - 38 + 16, 56, 3);
  ctx.fillRect(cx - 28, cy - 38 + 26, 56, 3);
  // Board face
  ctx.fillStyle = "#e8b860";
  ctx.fillRect(cx - 26, cy - 36, 52, 34);

  // Border — colored when near
  ctx.strokeStyle = isNear ? zone.color : "#8b5a2b";
  ctx.lineWidth = isNear ? 3 : 2;
  ctx.strokeRect(cx - 26, cy - 36, 52, 34);

  // Nail corners
  ctx.fillStyle = "#8a8a8a";
  ctx.beginPath();
  ctx.arc(cx - 23, cy - 33, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 23, cy - 33, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - 23, cy - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 23, cy - 5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Icon
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(zone.icon, cx, cy - 24);

  // Label text
  ctx.font = `bold 8px "Fira Code", monospace`;
  ctx.fillStyle = "#3d2200";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(zone.label, cx, cy - 10);

  // "PRESS E" when near — glowing
  if (isNear) {
    ctx.font = '7px "Fira Code", monospace';
    ctx.fillStyle = zone.color;
    ctx.shadowColor = zone.color;
    ctx.shadowBlur = 6;
    ctx.fillText("[ PRESS E ]", cx, cy - 2);
    ctx.shadowBlur = 0;
  }

  // Glow aura when near
  if (isNear) {
    const grd = ctx.createRadialGradient(cx, cy - 20, 0, cx, cy - 20, 40);
    grd.addColorStop(0, zone.color + "33");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 40 * (0.8 + pulse * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Path dots ───────────────────────────────────────────────────
function drawPath(ctx, path) {
  if (!path || path.length < 2) return;
  path.forEach((tile, i) => {
    ctx.fillStyle = `rgba(255,200,50,${(i / path.length) * 0.6})`;
    ctx.beginPath();
    ctx.arc(
      tile.col * TILE_SIZE + TILE_SIZE / 2,
      tile.row * TILE_SIZE + TILE_SIZE / 2,
      3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  });
}

// ── Player ───────────────────────────────────────────────────────
function drawPlayer(ctx, player) {
  const px = Math.round(player.x);
  const py = Math.round(player.y);
  const f = player.frame;
  const mv = player.moving;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px + 2, py + 12, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const S = 2;
  function dot(ox, oy, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(px + ox * S - 12),
      Math.round(py + oy * S - 24),
      w * S,
      h * S,
    );
  }

  // Hair — dark brown
  dot(2, 0, 8, 1, "#3d2200");
  dot(1, 1, 2, 1, "#3d2200");
  dot(9, 1, 2, 1, "#3d2200");
  dot(3, 1, 6, 1, "#5a3310");
  dot(1, 2, 2, 1, "#5a3310");
  dot(9, 2, 2, 1, "#5a3310");

  // Head — warm skin
  dot(1, 2, 10, 6, "#f5c88a");
  // Eyes
  dot(2, 3, 2, 2, "#2a1a08");
  dot(8, 3, 2, 2, "#2a1a08");
  dot(2, 3, 1, 1, "white");
  dot(8, 3, 1, 1, "white");
  // Eyebrows
  dot(2, 2, 3, 1, "#3d2200");
  dot(7, 2, 3, 1, "#3d2200");
  // Nose
  dot(5, 5, 2, 1, "#d4a870");
  // Mouth
  dot(4, 6, 4, 1, "#c07050");

  // Neck
  dot(4, 8, 4, 2, "#f5c88a");

  // Body — blue shirt + dark pants vibe (like reference character)
  dot(1, 10, 10, 5, "#3a6abf"); // blue shirt
  dot(5, 10, 2, 4, "#2a5aaa"); // shirt center seam
  dot(2, 10, 1, 4, "#5080cf"); // left highlight
  dot(1, 14, 10, 1, "#d4a030"); // belt — gold
  // Collar
  dot(4, 10, 4, 2, "#f5c88a");

  // Pants — dark
  const pant = "#2a3a5a",
    boot = "#1a2030";
  if (!mv || f === 0 || f === 2) {
    dot(2, 15, 3, 5, pant);
    dot(7, 15, 3, 5, pant);
    dot(1, 19, 5, 2, boot);
    dot(6, 19, 5, 2, boot);
  } else if (f === 1) {
    dot(2, 15, 3, 4, pant);
    dot(7, 15, 3, 6, pant);
    dot(1, 18, 5, 2, boot);
    dot(6, 20, 5, 2, boot);
  } else {
    dot(2, 15, 3, 6, pant);
    dot(7, 15, 3, 4, pant);
    dot(1, 20, 5, 2, boot);
    dot(6, 18, 5, 2, boot);
  }

  // Arms
  const armSwing = mv && (f === 1 || f === 3) ? 1 : 0;
  dot(-1, 10 + armSwing, 2, 5, "#f5c88a"); // left arm (skin)
  dot(11, 10 - armSwing, 2, 5, "#f5c88a"); // right arm (skin)
  // Sleeves
  dot(-1, 10 + armSwing, 2, 2, "#3a6abf");
  dot(11, 10 - armSwing, 2, 2, "#3a6abf");
}

// ── Interact prompt ──────────────────────────────────────────────
function drawPrompt(ctx, W, H, zone) {
  const text = `[E]  ${zone.label}`;
  ctx.font = 'bold 13px "Fira Code", monospace';
  const tw = ctx.measureText(text).width;
  const pad = 18,
    bw = tw + pad * 2,
    bh = 40;
  const bx = (W - bw) / 2,
    by = H - 100;

  // Wooden sign style prompt
  ctx.fillStyle = "#d4a853";
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = "#e8b860";
  ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);
  ctx.strokeStyle = "#8b5a2b";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  ctx.fillStyle = "#3d2200";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, by + bh / 2);
}

// ── Minimap ──────────────────────────────────────────────────────
function drawMinimap(ctx, W, H, player) {
  const scale = 3;
  const mmW = MAP_COLS * scale,
    mmH = MAP_ROWS * scale;
  const mx = W - mmW - 14,
    my = 14;

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(mx - 3, my - 3, mmW + 6, mmH + 6);
  ctx.strokeStyle = "#8b5a2b";
  ctx.lineWidth = 2;
  ctx.strokeRect(mx - 3, my - 3, mmW + 6, mmH + 6);

  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      const t = MAP[row][col];
      ctx.fillStyle =
        t === T.WALL
          ? "#2d7a2d"
          : t === T.COBBLE
            ? "#9e9e9e"
            : t === T.PATH
              ? "#c8b89a"
              : t === T.WATER
                ? "#3a9ad9"
                : t === T.GRASS
                  ? "#5cb85c"
                  : t === T.FOUNTAIN
                    ? "#2980b9"
                    : t === T.TREE || t === T.BUSH
                      ? "#228b22"
                      : t === T.LAMP
                        ? "#aaaaaa"
                        : "#5cb85c";
      ctx.fillRect(mx + col * scale, my + row * scale, scale, scale);
    }
  }

  ZONES.forEach((z) => {
    ctx.fillStyle = z.color;
    ctx.fillRect(mx + z.tileX * scale - 1, my + z.tileY * scale - 1, 4, 4);
  });

  const ppx = mx + (player.x / TILE_SIZE) * scale;
  const ppy = my + (player.y / TILE_SIZE) * scale;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ppx, ppy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ppx, ppy, 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = 'bold 7px "Fira Code", monospace';
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("MAP", mx, my - 2);
}
