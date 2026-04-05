import { TILE_SIZE, MAP_COLS, MAP_ROWS, MAP, T } from "../data/mapData";
import { canMoveTo } from "./collision";

export const SPEED = 2.2;
export const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

export function createPlayer() {
  return {
    x: Math.floor(MAP_COLS / 2) * TILE_SIZE + TILE_SIZE / 2,
    y: Math.floor(MAP_ROWS / 2) * TILE_SIZE + TILE_SIZE / 2,
    dir: DIRECTIONS.DOWN,
    moving: false,
    frame: 0,
    frameTick: 0,
    path: [], // array of {col, row} tiles to walk
  };
}

// BFS pathfinding — returns array of {col, row} or []
export function findPath(fromX, fromY, toCol, toRow) {
  const startCol = Math.floor(fromX / TILE_SIZE);
  const startRow = Math.floor(fromY / TILE_SIZE);

  if (startCol === toCol && startRow === toRow) return [];

  const queue = [{ col: startCol, row: startRow, path: [] }];
  const visited = new Set();
  visited.add(`${startCol},${startRow}`);

  const dirs = [
    { dc: 0, dr: -1 },
    { dc: 0, dr: 1 },
    { dc: -1, dr: 0 },
    { dc: 1, dr: 0 },
  ];

  while (queue.length > 0) {
    const { col, row, path } = queue.shift();

    for (const { dc, dr } of dirs) {
      const nc = col + dc;
      const nr = row + dr;
      const key = `${nc},${nr}`;

      if (visited.has(key)) continue;
      if (nr < 0 || nr >= MAP_ROWS || nc < 0 || nc >= MAP_COLS) continue;

      const tile = MAP[nr][nc];
      if (tile === T.WALL || tile === T.BUILDING) continue;

      const newPath = [...path, { col: nc, row: nr }];

      if (nc === toCol && nr === toRow) return newPath;

      visited.add(key);
      queue.push({ col: nc, row: nr, path: newPath });
    }
  }

  return []; // no path found
}

export function updatePlayer(player, keys) {
  let dx = 0,
    dy = 0;

  // Keyboard input overrides path
  const usingKeys =
    keys["ArrowUp"] ||
    keys["w"] ||
    keys["W"] ||
    keys["ArrowDown"] ||
    keys["s"] ||
    keys["S"] ||
    keys["ArrowLeft"] ||
    keys["a"] ||
    keys["A"] ||
    keys["ArrowRight"] ||
    keys["d"] ||
    keys["D"];

  if (usingKeys) {
    player.path = []; // cancel tap path on keypress
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) dy = -SPEED;
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) dy = SPEED;
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dx = -SPEED;
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx = SPEED;

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    if (dy < 0) player.dir = DIRECTIONS.UP;
    else if (dy > 0) player.dir = DIRECTIONS.DOWN;
    else if (dx < 0) player.dir = DIRECTIONS.LEFT;
    else if (dx > 0) player.dir = DIRECTIONS.RIGHT;
  } else if (player.path.length > 0) {
    // Follow tap path
    const next = player.path[0];
    const targetX = next.col * TILE_SIZE + TILE_SIZE / 2;
    const targetY = next.row * TILE_SIZE + TILE_SIZE / 2;

    const diffX = targetX - player.x;
    const diffY = targetY - player.y;
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);

    if (dist < SPEED + 0.5) {
      // Snap to tile center and advance path
      player.x = targetX;
      player.y = targetY;
      player.path.shift();
    } else {
      dx = (diffX / dist) * SPEED;
      dy = (diffY / dist) * SPEED;

      if (Math.abs(dy) >= Math.abs(dx) && dy < 0) player.dir = DIRECTIONS.UP;
      else if (Math.abs(dy) >= Math.abs(dx) && dy > 0)
        player.dir = DIRECTIONS.DOWN;
      else if (dx < 0) player.dir = DIRECTIONS.LEFT;
      else player.dir = DIRECTIONS.RIGHT;
    }
  }

  player.moving = dx !== 0 || dy !== 0;

  if (dx !== 0 || dy !== 0) {
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (canMoveTo(nx, player.y)) player.x = nx;
    if (canMoveTo(player.x, ny)) player.y = ny;

    // Clamp
    player.x = Math.max(
      TILE_SIZE,
      Math.min(player.x, (MAP_COLS - 1) * TILE_SIZE),
    );
    player.y = Math.max(
      TILE_SIZE,
      Math.min(player.y, (MAP_ROWS - 1) * TILE_SIZE),
    );
  }

  // Walk animation
  if (player.moving) {
    player.frameTick++;
    if (player.frameTick >= 10) {
      player.frame = (player.frame + 1) % 4;
      player.frameTick = 0;
    }
  } else {
    player.frame = 0;
    player.frameTick = 0;
  }
}
