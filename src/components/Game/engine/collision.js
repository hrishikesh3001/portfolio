import { MAP, T, TILE_SIZE } from "../data/mapData";

export function isSolid(tileX, tileY) {
  if (tileY < 0 || tileY >= MAP.length) return true;
  if (tileX < 0 || tileX >= MAP[0].length) return true;
  const tile = MAP[tileY][tileX];
  return tile === T.WALL || tile === T.BUILDING;
}

export function canMoveTo(pixelX, pixelY, size = 12) {
  const margin = size / 2;
  const corners = [
    { x: pixelX - margin, y: pixelY - margin },
    { x: pixelX + margin, y: pixelY - margin },
    { x: pixelX - margin, y: pixelY + margin },
    { x: pixelX + margin, y: pixelY + margin },
  ];
  return corners.every((c) => {
    const tx = Math.floor(c.x / TILE_SIZE);
    const ty = Math.floor(c.y / TILE_SIZE);
    return !isSolid(tx, ty);
  });
}
