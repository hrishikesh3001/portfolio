// Reserved for future tile animations / dynamic tile changes
export function getTileAt(map, col, row) {
  if (row < 0 || row >= map.length) return null;
  if (col < 0 || col >= map[0].length) return null;
  return map[row][col];
}
