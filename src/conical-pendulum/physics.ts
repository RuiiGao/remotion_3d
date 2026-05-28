export type PendulumState = {
  time: number;
  omega: number;
  alpha: number;
  phase: number;
  theta: number;
  radius: number;
  height: number;
  period: number;
  tension: number;
  weight: number;
  centripetal: number;
  speed: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const pendulumConstants = {
  length: 3.8,
  mass: 0.82,
  gravity: 9.81,
  omegaStart: 1.75,
  omegaEnd: 2.75,
  durationSeconds: 12,
};

export const getPendulumState = (time: number): PendulumState => {
  const { length, mass, gravity, omegaStart, omegaEnd, durationSeconds } =
    pendulumConstants;
  const clampedTime = clamp(time, 0, durationSeconds);
  const alpha = (omegaEnd - omegaStart) / durationSeconds;
  const omega = omegaStart + alpha * clampedTime;
  const phase = omegaStart * clampedTime + 0.5 * alpha * clampedTime ** 2;
  const cosTheta = clamp(gravity / (omega ** 2 * length), 0.18, 0.98);
  const theta = Math.acos(cosTheta);
  const radius = length * Math.sin(theta);
  const height = length * Math.cos(theta);
  const weight = mass * gravity;
  const tension = weight / Math.cos(theta);
  const centripetal = mass * omega ** 2 * radius;

  return {
    time: clampedTime,
    omega,
    alpha,
    phase,
    theta,
    radius,
    height,
    period: (2 * Math.PI) / omega,
    tension,
    weight,
    centripetal,
    speed: omega * radius,
  };
};
