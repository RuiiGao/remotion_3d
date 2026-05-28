import React from "react";
import { interpolate } from "remotion";
import { PendulumState, pendulumConstants } from "./physics";

type MetricsProps = {
  state: PendulumState;
  frame: number;
};

const fmt = (value: number, digits = 2) => value.toFixed(digits);

export const MetricsOverlay: React.FC<MetricsProps> = ({ state, frame }) => {
  const progress = state.time / pendulumConstants.durationSeconds;
  const sweep = `${Math.round(progress * 100)}%`;
  const fade = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="overlay" style={{ opacity: fade }}>
      <header className="titleBlock">
        <div className="kicker">3D CONICAL PENDULUM</div>
        <h1>圆锥摆：角速度缓慢增大</h1>
        <p>绳长固定，摆球半径随 ω 增大而扩张；黄色为张力 T，红色为重力 mg，绿色为向心合力。</p>
      </header>

      <aside className="panel">
        <div className="panelHeader">
          <span>实时指标</span>
          <strong>{fmt(state.time, 1)} s</strong>
        </div>
        <Metric label="角速度 ω" value={`${fmt(state.omega)} rad/s`} emphasis />
        <Metric label="角加速度 α" value={`${fmt(state.alpha, 3)} rad/s²`} />
        <Metric label="圆周半径 r" value={`${fmt(state.radius)} m`} />
        <Metric label="摆角 θ" value={`${fmt((state.theta * 180) / Math.PI, 1)}°`} />
        <Metric label="线速度 v" value={`${fmt(state.speed)} m/s`} />
        <Metric label="周期 T₀" value={`${fmt(state.period)} s`} />

        <div className="progressTrack">
          <div className="progressFill" style={{ width: sweep }} />
        </div>
      </aside>

      <section className="forcePanel">
        <div className="forceRow tension">
          <span>张力 T</span>
          <b>{fmt(state.tension)} N</b>
        </div>
        <div className="forceRow gravity">
          <span>重力 mg</span>
          <b>{fmt(state.weight)} N</b>
        </div>
        <div className="forceRow centripetal">
          <span>向心力 mω²r</span>
          <b>{fmt(state.centripetal)} N</b>
        </div>
      </section>

      <footer className="formula">
        <span>cos θ = g / (ω²L)</span>
        <span>r = L sin θ</span>
        <span>F向 = mω²r</span>
      </footer>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; emphasis?: boolean }> = ({
  label,
  value,
  emphasis = false,
}) => (
  <div className={emphasis ? "metric metricEmphasis" : "metric"}>
    <span>{label}</span>
    <b>{value}</b>
  </div>
);
