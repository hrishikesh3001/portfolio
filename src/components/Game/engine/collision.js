import {
  MAP,
  SOLID_TILES,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
} from "../data/mapData";

export function isSolid(tileX, tileY) {
  if (tileY < 0 || tileY >= MAP_ROWS) return true;
  if (tileX < 0 || tileX >= MAP_COLS) return true;
  return SOLID_TILES.has(MAP[tileY][tileX]);
}

export function canMoveTo(pixelX, pixelY, size = 12) {
  const margin = size / 2;
  return [
    { x: pixelX - margin, y: pixelY - margin },
    { x: pixelX + margin, y: pixelY - margin },
    { x: pixelX - margin, y: pixelY + margin },
    { x: pixelX + margin, y: pixelY + margin },
  ].every(
    (c) => !isSolid(Math.floor(c.x / TILE_SIZE), Math.floor(c.y / TILE_SIZE)),
  );
}
