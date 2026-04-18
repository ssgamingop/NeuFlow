"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function Cloud({ color, isMalignant, count = 100 }: { color: string; isMalignant: boolean; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        // Generate points in a cluster
        const x = (Math.random() - 0.5) * 3 + (isMalignant ? 1.5 : -1.5);
        const y = (Math.random() - 0.5) * 3 + (isMalignant ? 1.5 : -1.5);
        const z = (Math.random() - 0.5) * 2;
        temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, [count, isMalignant]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
        // slight wriggle
        const t = state.clock.elapsedTime + i;
        const wiggleX = Math.sin(t * 0.5) * 0.1;
        const wiggleY = Math.cos(t * 0.4) * 0.1;
        dummy.position.set(particle.x + wiggleX, particle.y + wiggleY, particle.z);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
}

function DividingPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Oscillate the plane slightly to look like it's continuously learning/adjusting
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#8b5cf6" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      {/* Edges for the plane */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(8, 8)]} />
        <lineBasicMaterial attach="material" color="#22d3ee" opacity={0.5} transparent />
      </lineSegments>
    </mesh>
  );
}

export default function ScatterPlot3D() {
  return (
    <div className="w-full h-full relative bg-[#0a0a1f] rounded-2xl overflow-hidden border border-primary/20">
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <fog attach="fog" args={["#0a0a1f", 5, 20]} />
        <ambientLight intensity={0.5} />
        <Stars radius={10} depth={50} count={1000} factor={2} fade speed={1} />
        
        {/* Class A: Benign */}
        <Cloud color="#06b6d4" isMalignant={false} count={150} />
        {/* Class B: Malignant */}
        <Cloud color="#f472b6" isMalignant={true} count={150} />
        
        {/* ML Boundary */}
        <DividingPlane />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="flex flex-col gap-2 bg-background/60 backdrop-blur-sm p-3 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#06b6d4]" /><span className="text-xs font-mono">Class A</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f472b6]" /><span className="text-xs font-mono">Class B</span></div>
        </div>
        <p className="text-xs text-muted/60 font-mono bg-background/40 backdrop-blur-md py-1 px-3 rounded-full inline-block">
          Interactive: Drag to rotate
        </p>
      </div>
    </div>
  );
}
