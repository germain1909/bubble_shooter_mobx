export const CANVAS_W = 480;
export const CANVAS_H = 720;
export const BUBBLE_R = 16;
export const ROW_HEIGHT = Math.sqrt(3) * BUBBLE_R; // hex vertical spacing
export const COLS = Math.floor(CANVAS_W / (BUBBLE_R * 2));
export const COLORS = ["#A100FF", "#FFFFFF", "#B3B3B3"]; // purple, white, grey
export const SHOOT_SPEED = 420; // px/s (used to compute animation duration)
