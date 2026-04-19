"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, RotateCcw, Minus, Plus } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import gsap from "gsap";

/* ─── The 3D Math Logic ─── */
// f(x, z) = x^2 + z^2 with some sine waves
const costFn3D = (x: number, z: number) => {
  return (Math.pow(x, 2) + Math.pow(z, 2)) * 0.15 + Math.sin(x * 2) * 0.2 + Math.cos(z * 2) * 0.2;
};

// Gradients (partial derivatives)
const gradX = (x: number) => x * 0.3 + 0.4 * Math.cos(x * 2);
const gradZ = (z: number) => z * 0.3 - 0.4 * Math.sin(z * 2);

/* ─── 3D Surface Component ─── */
function LandscapeSurface() {
  const geometry = useMemo(() => {
    return new ParametricGeometry((u: number, v: number, target: THREE.Vector3) => {
      const x = (u - 0.5) * 8; // -4 to 4
      const z = (v - 0.5) * 8; // -4 to 4
      const y = costFn3D(x, z);
      target.set(x, y, z);
    }, 50, 50);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -1, 0]}>
      <meshStandardMaterial 
        color="#8b5cf6" 
        wireframe={true} 
        transparent 
        opacity={0.25} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── The Agent rolling down the hill ─── */
function AgentBall({ positionArr }: { positionArr: [number, number][] }) {
  const ballRef = useRef<THREE.Mesh>(null!);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Animate the ball using GSAP whenever positionArr changes
  useEffect(() => {
    if (positionArr.length <= 1) {
      if (ballRef.current && positionArr[0]) {
        const [x, z] = positionArr[0];
        ballRef.current.position.set(x, costFn3D(x, z) - 1 + 0.15, z);
        setCurrentIdx(0);
      }
      return;
    }

    const dummy = { progress: 0 };
    const maxIdx = positionArr.length - 1;

    gsap.to(dummy, {
      progress: 1,
      duration: Math.min(positionArr.length * 0.1, 4), // Dynamic duration based on steps, max 4s
      ease: "power2.out",
      onUpdate: () => {
         const floatIdx = dummy.progress * maxIdx;
         const idxFloor = Math.floor(floatIdx);
         const idxCeil = Math.min(idxFloor + 1, maxIdx);
         const interp = floatIdx - idxFloor;

         // Linear interpolation between the two step coordinates
         const p1 = positionArr[idxFloor];
         const p2 = positionArr[idxCeil];
         
         const x = p1[0] + (p2[0] - p1[0]) * interp;
         const z = p1[1] + (p2[1] - p1[1]) * interp;
         
         if (ballRef.current) {
             ballRef.current.position.set(x, costFn3D(x, z) - 1 + 0.15, z);
         }
         setCurrentIdx(Math.round(floatIdx));
      }
    });

    return () => { gsap.killTweensOf(dummy); };
  }, [positionArr]);

  const currentPos = positionArr[currentIdx] || positionArr[0];

  return (
    <mesh ref={ballRef}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} />
      
      {/* Floating UI label above ball */}
      {currentPos && (
          <Html position={[0, 0.4, 0]} center className="pointer-events-none">
            <div className="bg-background/80 backdrop-blur-md border border-primary/30 px-2 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap">
              Cost: {costFn3D(currentPos[0], currentPos[1]).toFixed(3)}
            </div>
          </Html>
      )}
    </mesh>
  );
}

export default function GradientDescentSimulator() {
  const [learningRate, setLearningRate] = useState(0.2);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<[number, number][]>([[3, 3]]); // Start at [3, 3]

  const runDescent = () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Mathematically pre-calculate the total path trace immediately
    const tempHistory: [number, number][] = [[3, 3]];
    let currX = 3;
    let currZ = 3;
    
    for (let step = 0; step < 100; step++) {
       const gx = gradX(currX);
       const gz = gradZ(currZ);
       
       currX = currX - learningRate * gx;
       currZ = currZ - learningRate * gz;
       
       // Clamp to bounds
       currX = Math.max(-4, Math.min(4, currX));
       currZ = Math.max(-4, Math.min(4, currZ));
       
       tempHistory.push([currX, currZ]);
       
       // Stop if gradient is nearly 0
       if (Math.abs(gx) < 0.001 && Math.abs(gz) < 0.001) break;
    }
    
    setHistory(tempHistory);
    
    // Unlock button after animation est
    setTimeout(() => {
        setIsRunning(false);
    }, Math.min(tempHistory.length * 0.1, 4) * 1000 + 500);
  };

  const reset = () => {
    setIsRunning(false);
    setHistory([[3, 3]]);
  };

  const curr = history[history.length - 1];
  const currentCost = costFn3D(curr[0], curr[1]);

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <div className="glass rounded-2xl h-[350px] overflow-hidden relative border border-primary/20">
        <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
            <fog attach="fog" args={["#0a0a1f", 5, 20]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} color="#f472b6" />
            <Stars radius={10} depth={50} count={500} factor={2} fade speed={1} />
            
            <LandscapeSurface />
            <AgentBall positionArr={history} />
            
            {/* Global Minimum Indicator */}
            <mesh position={[0, costFn3D(0, 0) - 1, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#f472b6" transparent opacity={0.5} />
            </mesh>

            <OrbitControls autoRotate={!isRunning} autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 6} />
        </Canvas>
        
        <div className="absolute top-4 right-4 pointer-events-none">
            <div className="bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-muted flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               OrbitControls Enabled
            </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Final Position (x,z)</p>
          <p className="text-lg font-mono font-bold text-primary-light">
            {curr[0].toFixed(2)}, {curr[1].toFixed(2)}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Final Cost</p>
          <p className="text-lg font-mono font-bold text-accent-light">
            {currentCost.toFixed(4)}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Steps / Epochs</p>
          <p className="text-lg font-mono font-bold text-neon-pink">
            {history.length - 1}
          </p>
        </div>
      </div>

      {/* Learning rate control */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted">Learning Rate</span>
          <span className="text-sm font-mono text-primary-light font-bold">
            {learningRate.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (!isRunning) setLearningRate((lr) => Math.max(0.01, lr - 0.05)); setHistory([[3, 3]]); }}
            disabled={isRunning}
            className="p-1.5 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors disabled:opacity-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="range"
            min="0.01"
            max="0.8"
            step="0.01"
            value={learningRate}
            disabled={isRunning}
            onChange={(e) => { setLearningRate(parseFloat(e.target.value)); setHistory([[3, 3]]); }}
            className="flex-1 accent-primary"
          />
          <button
            onClick={() => { if (!isRunning) setLearningRate((lr) => Math.min(0.8, lr + 0.05)); setHistory([[3, 3]]); }}
            disabled={isRunning}
            className="p-1.5 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors disabled:opacity-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={runDescent}
          disabled={isRunning || history.length > 1}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 active:scale-95"
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Simulating..." : history.length > 1 ? "Descent Complete" : "Run Descent"}
        </button>
        <button
          onClick={reset}
          disabled={isRunning}
          className="px-5 py-3 rounded-full glass text-muted font-semibold hover:bg-primary/10 transition-colors disabled:opacity-50 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
