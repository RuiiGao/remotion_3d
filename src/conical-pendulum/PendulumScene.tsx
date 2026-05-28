import React, { useMemo } from "react";
import {
  Vector3,
  Quaternion,
  Color,
  BufferGeometry,
  Float32BufferAttribute,
  Line as ThreeLine,
  LineBasicMaterial,
} from "three";
import { PendulumState, pendulumConstants } from "./physics";

type SceneProps = {
  state: PendulumState;
  intro: number;
};

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

const CylinderBetween: React.FC<{
  start: Vector3;
  end: Vector3;
  radius: number;
  color: string;
  opacity?: number;
}> = ({ start, end, radius, color, opacity = 1 }) => {
  const direction = useMemo(() => end.clone().sub(start), [start, end]);
  const midpoint = useMemo(() => start.clone().add(end).multiplyScalar(0.5), [start, end]);
  const length = direction.length();
  const quaternion = useMemo(() => {
    const q = new Quaternion();
    q.setFromUnitVectors(v(0, 1, 0), direction.clone().normalize());
    return q;
  }, [direction]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 24]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

const ArrowVector: React.FC<{
  start: Vector3;
  vector: Vector3;
  color: string;
  radius?: number;
  head?: number;
}> = ({ start, vector, color, radius = 0.025, head = 0.18 }) => {
  const end = useMemo(() => start.clone().add(vector), [start, vector]);
  const direction = vector.clone().normalize();
  const shaftEnd = end.clone().sub(direction.multiplyScalar(head));
  const quaternion = useMemo(() => {
    const q = new Quaternion();
    q.setFromUnitVectors(v(0, 1, 0), vector.clone().normalize());
    return q;
  }, [vector]);

  return (
    <group>
      <CylinderBetween start={start} end={shaftEnd} radius={radius} color={color} />
      <mesh position={end} quaternion={quaternion}>
        <coneGeometry args={[radius * 4, head * 1.4, 28]} />
        <meshStandardMaterial color={color} emissive={new Color(color)} emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
};

const Axis: React.FC = () => (
  <group>
    <CylinderBetween start={v(0, 0.25, 0)} end={v(0, -3.9, 0)} radius={0.01} color="#6b7280" opacity={0.55} />
    <mesh position={[0, -3.95, 0]}>
      <coneGeometry args={[0.07, 0.2, 24]} />
      <meshStandardMaterial color="#6b7280" />
    </mesh>
  </group>
);

const Polyline: React.FC<{
  points: Vector3[];
  color: string;
  opacity?: number;
}> = ({ points, color, opacity = 1 }) => {
  const lineObject = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(points.flatMap((point) => [point.x, point.y, point.z]), 3),
    );
    const material = new LineBasicMaterial({ color, transparent: true, opacity });
    return new ThreeLine(g, material);
  }, [color, opacity, points]);

  return <primitive object={lineObject} />;
};

export const PendulumScene: React.FC<SceneProps> = ({ state, intro }) => {
  const { length } = pendulumConstants;
  const pivot = v(0, 1.8, 0);
  const bob = v(
    state.radius * Math.cos(state.phase),
    pivot.y - state.height,
    state.radius * Math.sin(state.phase),
  );
  const radialIn = v(-bob.x, 0, -bob.z).normalize();
  const stringVector = pivot.clone().sub(bob);
  const bobScale = 0.9 + intro * 0.1;

  return (
    <>
      <color attach="background" args={["#08111f"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 6]} intensity={1.3} />
      <pointLight position={[-4, 3, -2]} intensity={55} color="#7dd3fc" />
      <group position={[0.35, 0.15, 0]} rotation={[0.18, -0.38, 0]}>
        <group position={[0, 0, -0.1]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
            <circleGeometry args={[3.4, 96]} />
            <meshStandardMaterial color="#101827" transparent opacity={0.38} />
          </mesh>
          <gridHelper args={[7.2, 18, "#334155", "#1f2937"]} position={[0, -2.04, 0]} />
        </group>

        <Axis />
        <mesh position={pivot}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.25} />
        </mesh>

        <CylinderBetween start={pivot} end={bob} radius={0.025} color="#dbeafe" />
        <Polyline points={[pivot, v(0, bob.y, 0), bob]} color="#94a3b8" opacity={0.55} />

        <mesh position={[0, bob.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[state.radius, 0.012, 16, 160]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0891b2" emissiveIntensity={0.45} />
        </mesh>

        <ArrowVector start={bob} vector={stringVector.normalize().multiplyScalar(1.1)} color="#fde047" />
        <ArrowVector start={bob} vector={v(0, -1.05, 0)} color="#fb7185" />
        <ArrowVector start={bob} vector={radialIn.multiplyScalar(0.9)} color="#34d399" />

        <mesh position={bob} scale={bobScale}>
          <sphereGeometry args={[0.22, 48, 48]} />
          <meshStandardMaterial color="#f97316" roughness={0.28} metalness={0.18} emissive="#7c2d12" emissiveIntensity={0.18} />
        </mesh>

        <mesh position={[0, pivot.y - length, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[state.radius * 0.985, state.radius * 1.015, 96]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.18} />
        </mesh>
      </group>
    </>
  );
};
