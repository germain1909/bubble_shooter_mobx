import React from "react";
import GridView from "./components/GridView";
import HUD from "./components/HUD";
import { CANVAS_W, CANVAS_H } from "./config";

const App = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0d12",
        color: "#e5e7eb",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ position: "relative", width: CANVAS_W, height: CANVAS_H }}>
        <GridView />
        <HUD />
      </div>
    </div>
  );
};

export default App;