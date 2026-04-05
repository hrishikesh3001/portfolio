import { ZONES, TILE_SIZE } from "../data/mapData";

export function getNearbyZone(playerPixelX, playerPixelY, threshold = 52) {
  for (const zone of ZONES) {
    const zx = zone.tileX * TILE_SIZE + TILE_SIZE / 2;
    const zy = zone.tileY * TILE_SIZE + TILE_SIZE / 2;
    const dist = Math.sqrt(
      Math.pow(playerPixelX - zx, 2) + Math.pow(playerPixelY - zy, 2),
    );
    if (dist < threshold) return zone;
  }
  return null;
}
