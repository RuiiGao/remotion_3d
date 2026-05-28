import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PendulumScene } from "./PendulumScene";
import { MetricsOverlay } from "./MetricsOverlay";
import { getPendulumState } from "./physics";
import "./style.css";

export const ConicalPendulum: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = frame / fps;
  const state = getPendulumState(time);
  const intro = interpolate(frame, [0, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="page">
      <ThreeCanvas width={width} height={height}>
        <PendulumScene state={state} intro={intro} />
      </ThreeCanvas>
      <MetricsOverlay state={state} frame={frame} />
    </AbsoluteFill>
  );
};
