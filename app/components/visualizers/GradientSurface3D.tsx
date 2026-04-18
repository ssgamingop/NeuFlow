"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

function SurfaceMesh() {
  // Create a custom parametric geometry for x^2 + y^2 like surface
  const geometry = useMemo(() => {
    return new ParametricGeometry((u: number, v: number, target: THREE.Vector3) => {
      // Map u, v (0 to 1) to x, z (-3 to 3)
      const x = (u - 0.5) * 6;
      const z = (v - 0.5) * 6;
      // y = x^2 + z^2 with some ripples
      const y = (Math.pow(x, 2) + Math.pow(z, 2)) * 0.15 + Math.sin(x * 2) * 0.2 + Math.cos(z * 2) * 0.2;
      target.set(x, y, z);
    }, 40, 40);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -1, 0]}>
      <meshStandardMaterial 
        color="#8b5cf6" 
        wireframe={true} 
        transparent 
        opacity={0.3} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RollingBall() {
  const ballRef = useRef<THREE.Mesh>(null);
  
  // Custom function to get Y given X and Z
  const getY = (x: number, z: number) => {
    return (Math.pow(x, 2) + Math.pow(z, 2)) * 0.15 + Math.sin(x * 2) * 0.2 + Math.cos(z * 2) * 0.2 - 1 + 0.15; // +0.15 for ball radius offset
  };

  useFrame((state) => {
    if (!ballRef.current) return;
    
    // Simulate learning descent over a 10 second loop
    const t = (state.clock.elapsedTime % 10) / 10;
    
    let x, z;
    if (t < 0.1) {
      // Reset position to top
      x = 2.5; 
      z = 2.5;
    } else {
      // Exponential decay towards 0,0
      const progress = (t - 0.1) / 0.9;
      const factor = Math.exp(-progress * 5); // Decays to ~0 over the interval
      x = 2.5 * factor;
      z = 2.5 * factor;
    }
    
    const y = getY(x, z);
    ballRef.current.position.set(x, y, z);
  });

  return (
    <mesh ref={ballRef}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
    </mesh>
  );
}

export default function GradientSurface3D() {
  return (
    <div className="w-full h-full relative bg-[#0a0a1f] rounded-2xl overflow-hidden border border-primary/20">
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <fog attach="fog" args={["#0a0a1f", 5, 20]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} color="#f472b6" />
        <Stars radius={10} depth={50} count={500} factor={2} fade speed={1} />
        
        <SurfaceMesh />
        <RollingBall />
        
        {/* The Global Minimum Indicator */}
        <mesh position={[0, -1, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0.5} />
        </mesh>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-xs text-muted/60 font-mono bg-background/40 backdrop-blur-md py-1 px-3 rounded-full inline-block">
          Visual: Finding the Global Minimum Cost
        </p>
      </div>
    </div>
  );
}
