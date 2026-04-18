"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ─── Types ─── */
interface NeuronData {
  position: [number, number, number];
  color: string;
  scale: number;
  pulseSpeed: number;
  pulseOffset: number;
}

/* ─── Neuron with pulsing glow ─── */
function Neuron({ data }: { data: NeuronData }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const outerGlowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * data.pulseSpeed + data.pulseOffset);

    // Subtle float
    meshRef.current.position.y =
      data.position[1] + Math.sin(t * 0.3 + data.pulseOffset) * 0.1;

    // Core pulse
    const coreScale = data.scale * (1 + pulse * 0.15);
    meshRef.current.scale.setScalar(coreScale);

    // Inner glow pulse
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.scale.setScalar(data.scale * (1.8 + pulse * 0.4));
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + pulse * 0.03;
    }

    // Outer glow pulse
    if (outerGlowRef.current) {
      outerGlowRef.current.position.copy(meshRef.current.position);
      outerGlowRef.current.scale.setScalar(data.scale * (3 + pulse * 0.6));
      const mat = outerGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.02 + pulse * 0.015;
    }
  });

  return (
    <>
      {/* Core */}
      <mesh ref={meshRef} position={data.position}>
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      {/* Inner glow */}
      <mesh ref={glowRef} position={data.position}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.06} />
      </mesh>
      {/* Outer halo */}
      <mesh ref={outerGlowRef} position={data.position}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.02} />
      </mesh>
    </>
  );
}

/* ─── Signal pulse that travels along a connection ─── */
function SignalPulse({
  start,
  end,
  speed,
  delay,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  speed: number;
  delay: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = ((t * speed + delay) % 3) / 3; // 0 to 1 loop every 3s

    if (progress < 1) {
      ref.current.visible = true;
      ref.current.position.set(
        start[0] + (end[0] - start[0]) * progress,
        start[1] + (end[1] - start[1]) * progress,
        start[2] + (end[2] - start[2]) * progress
      );
      // Fade in/out at edges
      const fade = Math.sin(progress * Math.PI);
      ref.current.scale.setScalar(0.8 + fade * 0.5);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = fade * 0.7;
    } else {
      ref.current.visible = false;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

/* ─── Animated connection line ─── */
function Connection({
  start,
  end,
  color,
  pulseDelay,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  pulseDelay: number;
}) {
  const lineRef = useRef<THREE.Line>(null!);

  // Create line geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
    return geo;
  }, [start, end]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.06,
      }),
    [color]
  );

  // Animate opacity
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 0.5 + pulseDelay) * 0.03;
    }
  });

  return (
    <>
      <primitive
        ref={lineRef}
        object={new THREE.Line(geometry, material)}
      />
      {/* Traveling signal */}
      <SignalPulse
        start={start}
        end={end}
        speed={0.3 + Math.random() * 0.2}
        delay={pulseDelay}
        color={color}
      />
    </>
  );
}

/* ─── Floating ambient particles ─── */
function AmbientParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10 - 3,
      ] as [number, number, number],
      speed: 0.05 + Math.random() * 0.15,
      offset: Math.random() * Math.PI * 2,
      size: 0.005 + Math.random() * 0.008,
    }));
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.5,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.5,
        p.position[2] + Math.sin(t * p.speed * 0.3 + p.offset * 2) * 0.2
      );
      dummy.scale.setScalar(p.size + Math.sin(t * 0.8 + i) * 0.003);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} />
    </instancedMesh>
  );
}

/* ─── Mouse-tracking camera with smooth lerp ─── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useMemo(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [handleMouseMove]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.6 - camera.position.x) * 0.012;
    camera.position.y += (-mouse.current.y * 0.4 - camera.position.y) * 0.012;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Main Scene ─── */
function Scene() {
  const colors = ["#8b5cf6", "#a78bfa", "#06b6d4", "#22d3ee", "#c084fc", "#f472b6"];

  // Neuron positions — pushed to edges, framing center
  const neurons: NeuronData[] = useMemo(
    () => [
      // Left cluster
      { position: [-5.8, 2.2, -1.5], color: colors[0], scale: 1.1, pulseSpeed: 0.8, pulseOffset: 0 },
      { position: [-5.2, 0.6, -1.0], color: colors[1], scale: 0.9, pulseSpeed: 1.0, pulseOffset: 1.2 },
      { position: [-5.5, -0.8, -1.8], color: colors[2], scale: 1.0, pulseSpeed: 0.7, pulseOffset: 2.4 },
      { position: [-4.8, -2.0, -1.2], color: colors[3], scale: 0.8, pulseSpeed: 0.9, pulseOffset: 3.6 },
      { position: [-4.2, 1.5, -2.0], color: colors[4], scale: 0.85, pulseSpeed: 1.1, pulseOffset: 4.8 },
      // Upper arc
      { position: [-3.0, 3.2, -1.5], color: colors[5], scale: 0.7, pulseSpeed: 0.6, pulseOffset: 0.5 },
      { position: [-1.5, 3.8, -2.0], color: colors[0], scale: 0.6, pulseSpeed: 0.8, pulseOffset: 1.8 },
      { position: [1.5, 3.8, -2.0], color: colors[2], scale: 0.6, pulseSpeed: 0.7, pulseOffset: 3.0 },
      { position: [3.0, 3.2, -1.5], color: colors[4], scale: 0.7, pulseSpeed: 0.9, pulseOffset: 4.2 },
      // Right cluster
      { position: [5.8, 2.2, -1.5], color: colors[1], scale: 1.1, pulseSpeed: 0.8, pulseOffset: 0.8 },
      { position: [5.2, 0.6, -1.0], color: colors[3], scale: 0.9, pulseSpeed: 1.0, pulseOffset: 2.0 },
      { position: [5.5, -0.8, -1.8], color: colors[5], scale: 1.0, pulseSpeed: 0.7, pulseOffset: 3.2 },
      { position: [4.8, -2.0, -1.2], color: colors[0], scale: 0.8, pulseSpeed: 0.9, pulseOffset: 4.4 },
      { position: [4.2, 1.5, -2.0], color: colors[2], scale: 0.85, pulseSpeed: 1.1, pulseOffset: 5.0 },
      // Bottom arc
      { position: [-3.0, -3.0, -1.5], color: colors[1], scale: 0.7, pulseSpeed: 0.6, pulseOffset: 1.0 },
      { position: [-1.0, -3.5, -2.0], color: colors[3], scale: 0.6, pulseSpeed: 0.8, pulseOffset: 2.5 },
      { position: [1.0, -3.5, -2.0], color: colors[5], scale: 0.6, pulseSpeed: 0.7, pulseOffset: 3.8 },
      { position: [3.0, -3.0, -1.5], color: colors[4], scale: 0.7, pulseSpeed: 0.9, pulseOffset: 5.5 },
      // Deep background
      { position: [-2.5, 0.5, -4.0], color: colors[0], scale: 0.5, pulseSpeed: 0.5, pulseOffset: 0.3 },
      { position: [2.5, -0.5, -4.0], color: colors[2], scale: 0.5, pulseSpeed: 0.6, pulseOffset: 1.5 },
      { position: [0, 2.5, -5.0], color: colors[4], scale: 0.4, pulseSpeed: 0.4, pulseOffset: 2.8 },
      { position: [0, -2.5, -5.0], color: colors[1], scale: 0.4, pulseSpeed: 0.5, pulseOffset: 4.0 },
    ],
    []
  );

  // Compute connections between close neurons
  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number]; color: string; delay: number }[] = [];
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const a = neurons[i].position;
        const b = neurons[j].position;
        const dist = Math.sqrt(
          (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
        );
        if (dist < 3.2) {
          conns.push({
            start: a,
            end: b,
            color: neurons[i].color,
            delay: i * 0.5 + j * 0.3,
          });
        }
      }
    }
    return conns;
  }, [neurons]);

  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[6, 4, 4]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[-6, -3, 3]} intensity={0.2} color="#06b6d4" />
      <pointLight position={[0, 5, -3]} intensity={0.15} color="#f472b6" />
      <pointLight position={[0, -5, -3]} intensity={0.1} color="#22d3ee" />

      <CameraRig />

      <Float speed={0.3} rotationIntensity={0.03} floatIntensity={0.15}>
        <group>
          {neurons.map((n, i) => (
            <Neuron key={i} data={n} />
          ))}
          {connections.map((conn, i) => (
            <Connection
              key={i}
              start={conn.start}
              end={conn.end}
              color={conn.color}
              pulseDelay={conn.delay}
            />
          ))}
        </group>
      </Float>

      <AmbientParticles count={60} />
      <Stars
        radius={80}
        depth={70}
        count={2500}
        factor={2}
        saturation={0.2}
        fade
        speed={0.2}
      />
    </>
  );
}

/* ─── Exported Component ─── */
export default function NeuralNetworkScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
