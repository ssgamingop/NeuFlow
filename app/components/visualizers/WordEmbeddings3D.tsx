"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

const words = [
  { text: "Dog", pos: [2, 1, 0], color: "#8b5cf6" },
  { text: "Wolf", pos: [2.5, 1.2, 0.5], color: "#a78bfa" },
  { text: "Cat", pos: [1.5, 0.8, -0.5], color: "#8b5cf6" },
  { text: "Car", pos: [-2, -1, 1], color: "#06b6d4" },
  { text: "Bus", pos: [-2.5, -0.8, 1.5], color: "#22d3ee" },
  { text: "Apple", pos: [0, 2, -2], color: "#f472b6" },
  { text: "Banana", pos: [-0.5, 2.2, -1.8], color: "#f472b6" },
];

function WordClouds() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {words.map((word, i) => (
        <group key={i} position={word.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={word.color} />
          </mesh>
          <Html distanceFactor={10} center>
            <div
              className="px-2 py-1 rounded-md text-xs font-bold font-mono tracking-widest whitespace-nowrap blur-0"
              style={{
                color: "#fff",
                background: `${word.color}40`,
                border: `1px solid ${word.color}80`,
                backdropFilter: "blur(4px)",
              }}
            >
              {word.text}
            </div>
          </Html>
        </group>
      ))}

      {/* Lines between related concepts */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([...words[0].pos, ...words[1].pos])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#8b5cf6" opacity={0.3} transparent />
      </line>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([...words[0].pos, ...words[2].pos])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#8b5cf6" opacity={0.3} transparent />
      </line>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([...words[3].pos, ...words[4].pos])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#06b6d4" opacity={0.3} transparent />
      </line>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([...words[5].pos, ...words[6].pos])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#f472b6" opacity={0.3} transparent />
      </line>
    </group>
  );
}

export default function WordEmbeddings3D() {
  return (
    <div className="w-full h-full relative bg-[#0a0a1f] rounded-2xl overflow-hidden border border-primary/20">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <fog attach="fog" args={["#0a0a1f", 3, 10]} />
        <ambientLight intensity={0.5} />
        <Stars radius={10} depth={50} count={1000} factor={2} fade speed={1} />
        <WordClouds />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-xs text-muted/60 font-mono bg-background/40 backdrop-blur-md py-1 px-3 rounded-full inline-block">
          Interactive: Drag to rotate embedding space
        </p>
      </div>
    </div>
  );
}
