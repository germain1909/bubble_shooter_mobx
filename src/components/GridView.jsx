import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import gameStore, { START_X, START_Y } from "../gameStore";
import { CANVAS_W, CANVAS_H, BUBBLE_R } from "../config";
import Bubble from "./Bubble";
import ShotBubble from "./ShotBubble";

const GridView = observer(() => {
  const onClick = useCallback((e) => {
    // translate click to SVG coords
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    gameStore.shootToward(cursorpt.x, cursorpt.y);
  }, []);

  return (
    <svg
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ background: "#0e0f14", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
      onClick={onClick}
    >
      {/* ceiling line */}
      <line x1="0" y1={BUBBLE_R} x2={CANVAS_W} y2={BUBBLE_R} stroke="#334155" strokeWidth="2" />

      {/* cannon */}
      <circle cx={START_X} cy={START_Y} r="28" fill="#1f2430" />

      {/* bubbles */}
      {gameStore.cells.map((cell) => (
        <Bubble key={`${cell.row}-${cell.col}`} cell={cell} />
      ))}

      {/* shot animation */}
      <ShotBubble />
    </svg>
  );
});

export default GridView;