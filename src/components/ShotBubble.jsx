import React from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import gameStore from "../gameStore";
import { BUBBLE_R } from "../config";

const ShotBubble = observer(() => {
  const shot = gameStore.activeShot;
  if (!shot) return null;

  const xs = shot.path.map(p => p.x);
  const ys = shot.path.map(p => p.y);

  return (
    <motion.circle
      initial={{ cx: xs[0], cy: ys[0] }}
      animate={{ cx: xs, cy: ys }}
      transition={{ duration: shot.duration, ease: "linear" }}
      r={BUBBLE_R}
      fill={shot.color}
      onAnimationComplete={gameStore.commitShot}
      style={{ pointerEvents: "none" }}
    />
  );
});

export default ShotBubble;