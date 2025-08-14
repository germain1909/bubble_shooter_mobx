import { BUBBLE_R, ROW_HEIGHT, COLS, CANVAS_W } from "./config";

export const dist2 = (x1, y1, x2, y2) => {
  const dx = x1 - x2, dy = y1 - y2;
  return dx * dx + dy * dy;
};

export const cellToXY = (row, col) => {
  const x = BUBBLE_R + col * (BUBBLE_R * 2) + (row % 2 ? BUBBLE_R : 0);
  const y = BUBBLE_R + row * ROW_HEIGHT;
  return { x, y };
};

export const inBounds = (row, col, rows) =>
  row >= 0 && row < rows && col >= 0 && col < COLS;

export const neighborsOddR = (row, col) => {
  const odd = row % 2 === 1;
  return [
    { r: row, c: col - 1 }, { r: row, c: col + 1 },
    { r: row - 1, c: col + (odd ? 0 : -1) }, { r: row - 1, c: col + (odd ? 1 : 0) },
    { r: row + 1, c: col + (odd ? 0 : -1) }, { r: row + 1, c: col + (odd ? 1 : 0) },
  ];
};

// approximate snapping for odd-r hex grid
export const snapToGrid = (x, y, maxRows) => {
  const row = Math.max(0, Math.min(maxRows - 1, Math.round((y - BUBBLE_R) / ROW_HEIGHT)));
  const rowX = row % 2 ? BUBBLE_R : 0;
  const col = Math.max(0, Math.min(COLS - 1, Math.round((x - BUBBLE_R - rowX) / (BUBBLE_R * 2))));
  return { row, col };
};

// clamp within side walls for shot path
export const clampX = (x) => Math.max(BUBBLE_R, Math.min(CANVAS_W - BUBBLE_R, x));