import React from "react";
import { observer } from "mobx-react-lite";
import gameStore from "../gameStore";
import { BUBBLE_R} from "../config";
//import { BUBBLE_R, CANVAS_H, CANVAS_W } from "../config";


const HUD = observer(() => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: 12,
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          background: "rgba(2,6,23,0.6)",
          border: "1px solid rgba(148,163,184,0.2)",
          padding: "6px 10px",
          borderRadius: 10,
          fontSize: 14,
        }}
      >
        Score: <strong>{gameStore.score}</strong>
      </div>
      <div
        style={{
          pointerEvents: "auto",
          background: "rgba(2,6,23,0.6)",
          border: "1px solid rgba(148,163,184,0.2)",
          padding: "6px 10px",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>Next:</span>
        <span
          style={{
            width: BUBBLE_R * 1.5,
            height: BUBBLE_R * 1.5,
            borderRadius: "50%",
            background: gameStore.nextColor,
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
});

export default HUD;