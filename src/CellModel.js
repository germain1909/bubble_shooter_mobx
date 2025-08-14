import { makeAutoObservable } from "mobx";
import { BUBBLE_R, ROW_HEIGHT } from "./config";

class CellModel {
  constructor(row, col, color) {
    this.row = row;     // left plain (not observed)
    this.col = col;     // left plain (not observed)
    this.color = color; // observed

    makeAutoObservable(this, { row: false, col: false });
  }

  // computed
  get x() {
    return BUBBLE_R + this.col * (BUBBLE_R * 2) + (this.row % 2 ? BUBBLE_R : 0);
  }
  // computed
  get y() {
    return BUBBLE_R + this.row * ROW_HEIGHT;
  }

  // action (arrow = already bound)
  setColor = (c) => { this.color = c; };
}

export default CellModel;