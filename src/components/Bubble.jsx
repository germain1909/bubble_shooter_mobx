import React from "react";
import { observer } from "mobx-react-lite";
import { BUBBLE_R } from "../config";

const Bubble = observer(({ cell }) => {
  if (!cell.color) return null;
  return (
    <circle
      cx={cell.x}
      cy={cell.y}
      r={BUBBLE_R}
      fill={cell.color}
      stroke="#111827"
      strokeWidth="1"
    />
  );
});

export default Bubble;