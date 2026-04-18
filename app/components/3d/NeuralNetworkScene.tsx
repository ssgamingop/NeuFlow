"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Line } from "@react-three/drei";
import * as THREE from "three";

/* ─── Neuron Sphere ─── */
function Neuron({
  position,
  scale = 1,
  color = "#8b5cf6",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y =
      position[1] + Math.sin(t * 0.4 + position[0]) * 0.12;
    if (glowRef.current) {
      glowRef.current.position.copy(ref.current.position);
      const s = 1 + Math.sin(t * 1.2 + position[2]) * 0.1;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.06 * scale, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.12 * scale, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>
    </>
  );
}

/* ─── Connection Lines ─── */
function Connections({
  points,
}: {
  points: [number, number, number][];
}) {
  const connections = useMemo(() => {
    const conns: { start: number; end: number }[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Math.sqrt(
          (points[i][0] - points[j][0]) ** 2 +
            (points[i][1] - points[j][1]) ** 2 +
            (points[i][2] - points[j][2]) ** 2
        );
        if (dist < 2.8) {
          conns.push({ start: i, end: j });
        }
      }
    }
    return conns;
  }, [points]);

  return (
    <group>
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[points[conn.start], points[conn.end]]}
          color="#8b5cf6"
          lineWidth={0.8}
          transparent
          opacity={0.07}
        />
      ))}
    </group>
  );
}

/* ─── Floating Particles ─── */
function Particles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8 - 2,
        ] as [number, number, number],
        speed: 0.08 + Math.random() * 0.2,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.4,
        p.position[1] + Math.cos(t * p.speed * 0.6 + p.offset) * 0.4,
        p.position[2]
      );
      dummy.scale.setScalar(0.008 + Math.sin(t * 0.5 + i) * 0.004);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.3} />
    </instancedMesh>
  );
}

/* ─── Mouse-tracking camera ─── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.4 - camera.position.x) * 0.015;
    camera.position.y += (-mouse.current.y * 0.25 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  const { gl } = useThree();
  useMemo(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [gl, handleMouseMove]);

  return null;
}

/* ─── Main Scene — neurons pushed to edges, away from center text ─── */
function Scene() {
  const neuronPositions: [number, number, number][] = useMemo(
    () => [
      // Far left cluster
      [-5.5, 2.0, -1],
      [-5.0, 0.8, -0.5],
      [-5.2, -0.6, -1.2],
      [-4.8, -1.8, -0.8],
      [-4.5, 1.4, -1.5],
      // Upper-left arc
      [-3.5, 2.8, -1.0],
      [-2.8, 3.2, -1.5],
      [-2.0, 3.0, -0.8],
      // Upper-right arc
      [2.0, 3.0, -1.0],
      [2.8, 3.2, -1.2],
      [3.5, 2.8, -0.8],
      // Far right cluster
      [5.5, 2.0, -1],
      [5.0, 0.8, -0.5],
      [5.2, -0.6, -1.2],
      [4.8, -1.8, -0.8],
      [4.5, 1.4, -1.5],
      // Bottom-left
      [-3.5, -2.5, -1.0],
      [-2.5, -3.0, -1.5],
      // Bottom-right
      [3.5, -2.5, -1.0],
      [2.5, -3.0, -1.5],
      // Deep background scattered
      [-1.5, 3.5, -3],
      [1.5, 3.5, -3],
      [0, -3.5, -3],
      [-3, 0, -3.5],
      [3, 0, -3.5],
    ],
    []
  );

  const colors = [
    "#8b5cf6",
    "#a78bfa",
    "#06b6d4",
    "#22d3ee",
    "#c084fc",
    "#f472b6",
  ];

  // Stable random scales
  const scales = useMemo(
    () => neuronPositions.map((_, i) => 0.7 + ((i * 7 + 3) % 10) / 15),
    [neuronPositions]
  );

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[6, 4, 3]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[-6, -3, 2]} intensity={0.25} color="#06b6d4" />
      <pointLight position={[0, 4, -4]} intensity={0.15} color="#f472b6" />

      <CameraRig />

      <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.2}>
        <group>
          {neuronPositions.map((pos, i) => (
            <Neuron
              key={i}
              position={pos}
              scale={scales[i]}
              color={colors[i % colors.length]}
            />
          ))}
          <Connections points={neuronPositions} />
        </group>
      </Float>

      <Particles count={80} />
      <Stars
        radius={60}
        depth={60}
        count={2000}
        factor={2.5}
        saturation={0.3}
        fade
        speed={0.3}
      />
    </>
  );
}

/* ─── Exported Component ─── */
export default function NeuralNetworkScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
