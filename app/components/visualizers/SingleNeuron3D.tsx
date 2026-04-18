"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";
import * as THREE from "three";

function PulseLine({ start, end, color, speed = 1, delay = 0 }: { start: [number, number, number], end: [number, number, number], color: string, speed?: number, delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const vStart = new THREE.Vector3(...start);
  const vEnd = new THREE.Vector3(...end);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = ((state.clock.elapsedTime * speed) + delay) % 1;
    meshRef.current.position.lerpVectors(vStart, vEnd, t);
    // Fade out near the end
    const opacity = Math.sin(t * Math.PI);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
  });

  return (
    <group>
      {/* The physical connection line */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([...start, ...end])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={color} opacity={0.2} transparent />
      </line>
      {/* The traveling signal pulse */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function NeuronCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && haloRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1;
      coreRef.current.scale.set(pulse, pulse, pulse);
      haloRef.current.scale.set(pulse * 1.2, pulse * 1.2, pulse * 1.2);
    }
  });

  return (
    <group position={[1, 0, 0]}>
      {/* Outer Glow Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Inner Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function SingleNeuron3D() {
  // Input nodes (x, y, z)
  const inputs: [number, number, number][] = [
    [-3, 2, -1],
    [-3, 0.5, 1.5],
    [-3, -1, 0],
    [-3, -2.5, -0.5]
  ];
  const targetNeuron: [number, number, number] = [1, 0, 0];
  const outputNode: [number, number, number] = [4, 0, 0];

  return (
    <div className="w-full h-full relative bg-[#0a0a1f] rounded-2xl overflow-hidden border border-primary/20">
      <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
        <fog attach="fog" args={["#0a0a1f", 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={2} color="#8b5cf6" />
        <Stars radius={10} depth={50} count={500} factor={2} fade speed={1} />
        
        {/* Input Nodes */}
        {inputs.map((pos, i) => (
          <group key={`input-${i}`} position={pos}>
            <Sphere args={[0.15, 16, 16]}>
              <meshBasicMaterial color="#f472b6" opacity={0.6} transparent />
            </Sphere>
            {/* Input Lines sending signals to Core */}
            <PulseLine start={pos} end={targetNeuron} color="#f472b6" speed={0.5} delay={i * 0.25} />
          </group>
        ))}

        {/* Central Neuron */}
        <NeuronCore />

        {/* Output mechanism */}
        <PulseLine start={targetNeuron} end={outputNode} color="#06b6d4" speed={1} delay={0} />
        <group position={outputNode}>
            <Sphere args={[0.15, 16, 16]}>
              <meshBasicMaterial color="#06b6d4" opacity={0.6} transparent />
            </Sphere>
        </group>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
      </Canvas>
      <div className="absolute top-4 left-4 right-4 flex justify-between">
         <span className="text-xs font-mono text-[#f472b6] bg-[#f472b6]/10 px-2 py-1 rounded">Inputs + Weights</span>
         <span className="text-xs font-mono text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-1 rounded">Activation Output</span>
      </div>
    </div>
  );
}
