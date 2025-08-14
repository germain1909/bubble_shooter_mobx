import { makeAutoObservable, observable } from "mobx";
import CellModel from "./CellModel";
import { COLORS, COLS, CANVAS_W, CANVAS_H, BUBBLE_R, SHOOT_SPEED } from "./config";
import { cellToXY, neighborsOddR, inBounds, snapToGrid, dist2, clampX } from "./utils";

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const START_X = CANVAS_W / 2;
const START_Y = CANVAS_H - 60;

class GameStore {
  cells = [];        // shallow observed array of CellModel
  rows = 12;
  score = 0;
  nextColor = rand(COLORS);

  // activeShot: { path:[{x,y},...], color, duration, target: {row,col} }
  activeShot = null;

  popCount = 0;      // simple progression metric

  constructor() {
    makeAutoObservable(this, {
      cells: observable.shallow,
    });
    this.reset();
  }

  reset = () => {
    const list = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < COLS; c++) {
        list.push(new CellModel(r, c, r < 6 ? rand(COLORS) : null));
      }
    }
    this.cells = list;
    this.score = 0;
    this.popCount = 0;
    this.activeShot = null;
    this.nextColor = rand(COLORS);
  };

  cellAt = (row, col) => this.cells[row * COLS + col];

  // shoot with a path (keyframes) so React animates it; we compute physics up-front
  shootToward = (tx, ty) => {
    if (this.activeShot) return; // one at a time
    const res = this.computeShotPath({ x: START_X, y: START_Y }, { x: tx, y: ty });
    if (!res) return;
    const { path, impact, targetCell } = res;

    // duration by path length / speed
    let length = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i-1].x, dy = path[i].y - path[i-1].y;
      length += Math.hypot(dx, dy);
    }
    const duration = Math.max(0.12, length / SHOOT_SPEED);

    this.activeShot = {
      path,
      color: this.nextColor,
      duration,
      target: targetCell, // where we will place on completion
      impact,             // last point for animation
    };
    this.nextColor = rand(COLORS);
  };

  // simulate straight-line with wall bounces until ceiling/collision
  computeShotPath = (from, to) => {
    const stepPx = 4; // path resolution
    let dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    let vx = (dx / len) * stepPx;
    let vy = (dy / len) * stepPx;

    let x = from.x, y = from.y;
    const path = [{ x, y }];

    const maxRows = this.rows; // clamp snapping rows
    const maxIters = 10000;

    for (let i = 0; i < maxIters; i++) {
      // advance
      x += vx; y += vy;

      // bounce on side walls
      if (x <= BUBBLE_R) { x = BUBBLE_R; vx *= -1; }
      if (x >= CANVAS_W - BUBBLE_R) { x = CANVAS_W - BUBBLE_R; vx *= -1; }

      // ceiling
      if (y <= BUBBLE_R) {
        const snap = snapToGrid(x, y, maxRows);
        const targetCell = this.findPlacementAround(snap.row, snap.col, x, y);
        return { path: [...path, { x, y }], impact: { x, y }, targetCell };
      }

      // collision with existing bubbles
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = this.cellAt(r, c);
          if (!cell.color) continue;
          const { x: cx, y: cy } = cellToXY(r, c);
          if (dist2(x, y, cx, cy) <= (BUBBLE_R * 2 - 1) ** 2) {
            // impact detected just before overlap; backtrack slightly
            const impact = { x: clampX(x - vx * 0.5), y: y - vy * 0.5 };
            const snap = snapToGrid(impact.x, impact.y, maxRows);
            const targetCell = this.findPlacementAround(snap.row, snap.col, impact.x, impact.y);
            return { path: [...path, impact], impact, targetCell };
          }
        }
      }

      path.push({ x, y });
    }

    // no collision found (shouldn't happen) -> drop
    return null;
  };

  // look for nearest empty neighbor to snap into (including the snap cell)
  findPlacementAround = (r, c, shotX, shotY) => {
    r = Math.max(0, Math.min(this.rows - 1, r));
    c = Math.max(0, Math.min(COLS - 1, c));

    let best = { r, c, d2: Number.POSITIVE_INFINITY };
    const consider = [{ r, c }, ...neighborsOddR(r, c)];

    for (const pos of consider) {
      if (!inBounds(pos.r, pos.c, this.rows)) continue;
      const cell = this.cellAt(pos.r, pos.c);
      if (cell.color) continue; // occupied
      const { x, y } = cellToXY(pos.r, pos.c);
      const d2 = dist2(shotX, shotY, x, y);
      if (d2 < best.d2) best = { r: pos.r, c: pos.c, d2 };
    }

    // if none empty around, just return the snap cell (will overwrite)
    return { row: best.r, col: best.c };
  };

  // called by ShotBubble on animation end
  commitShot = () => {
    if (!this.activeShot) return;
    const { target, color } = this.activeShot;
    const cell = this.cellAt(target.row, target.col);
    cell.setColor(color);
    this.activeShot = null;

    // cluster pop
    const popped = this.popClusterFrom(cell);
    if (popped > 0) {
      this.score += popped * 10;
      this.popCount += popped;

      // drop floaters
      const dropped = this.dropFloaters();
      if (dropped) this.score += dropped * 15;

      // progression: add a new row every 8 pops
      if (this.popCount % 8 === 0) {
        this.pushNewRow();
      }
    }
  };

  // BFS of same-color cluster
  popClusterFrom = (startCell) => {
    if (!startCell.color) return 0;
    const target = startCell.color;
    const seen = new Set();
    const q = [startCell];
    const cluster = [];

    while (q.length) {
      const cur = q.shift();
      const key = `${cur.row}:${cur.col}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (cur.color !== target) continue;
      cluster.push(cur);

      for (const { r, c } of neighborsOddR(cur.row, cur.col)) {
        if (!inBounds(r, c, this.rows)) continue;
        const n = this.cellAt(r, c);
        if (n.color === target) q.push(n);
      }
    }

    if (cluster.length >= 3) {
      cluster.forEach((b) => b.setColor(null));
      return cluster.length;
    }
    return 0;
  };

  // mark top-connected bubbles, drop the rest
  dropFloaters = () => {
    const anchored = new Set();
    const q = [];

    for (let c = 0; c < COLS; c++) {
      const top = this.cellAt(0, c);
      if (top?.color) q.push(top);
    }

    while (q.length) {
      const cur = q.shift();
      const key = `${cur.row}:${cur.col}`;
      if (anchored.has(key)) continue;
      anchored.add(key);
      for (const { r, c } of neighborsOddR(cur.row, cur.col)) {
        if (!inBounds(r, c, this.rows)) continue;
        const n = this.cellAt(r, c);
        if (n.color && !anchored.has(`${n.row}:${n.col}`)) q.push(n);
      }
    }

    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = this.cellAt(r, c);
        if (cell.color && !anchored.has(`${r}:${c}`)) {
          cell.setColor(null);
          count++;
        }
      }
    }
    return count;
  };

  pushNewRow = () => {
    // add a new top row and push everything down; if overflow -> reset
    // create new CellModels with row=0, update existing row indices
    // (since row/col aren’t observed, x/y computed remain valid without reactivity)
    const newRow = [];
    for (let c = 0; c < COLS; c++) {
      newRow.push(new CellModel(0, c, Math.random() < 0.1 ? null : rand(COLORS)));
    }

    // bump existing rows +1
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      cell.row += 1; // safe: non-observed
    }

    // insert new row at top (row 0)
    this.cells = [...newRow, ...this.cells];

    // recompute rows count limit; if beyond screen, reset
    const maxRows = Math.floor((CANVAS_H - 140) / (Math.sqrt(3) * BUBBLE_R));
    if (this.rows + 1 > maxRows) {
      this.reset();
    } else {
      this.rows += 1;
    }
  };
}

const gameStore = new GameStore();
export default gameStore;
export { GameStore, START_X, START_Y };