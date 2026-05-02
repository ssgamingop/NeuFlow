"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, RotateCcw, Activity } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import gsap from "gsap";

export type Topography = "bowl" | "hills" | "saddle";

/* ─── Math Formulas ─── */
const mathModels = {
  bowl: {
    fn: (x: number, z: number) => (Math.pow(x, 2) + Math.pow(z, 2)) * 0.15,
    gradX: (x: number) => x * 0.3,
    gradZ: (z: number) => z * 0.3,
  },
  hills: {
    fn: (x: number, z: number) => (Math.pow(x, 2) + Math.pow(z, 2)) * 0.1 + Math.sin(x * 1.5) * 0.5 + Math.cos(z * 1.5) * 0.5,
    gradX: (x: number) => x * 0.2 + 0.75 * Math.cos(x * 1.5),
    gradZ: (z: number) => z * 0.2 - 0.75 * Math.sin(z * 1.5),
  },
  saddle: {
    fn: (x: number, z: number) => (Math.pow(x, 2) - Math.pow(z, 2)) * 0.15,
    gradX: (x: number) => x * 0.3,
    gradZ: (z: number) => -z * 0.3,
  }
};

/* ─── 3D Landscape Surface Component ─── */
function LandscapeSurface({ type }: { type: Topography }) {
  const geometry = useMemo(() => {
    return new ParametricGeometry((u: number, v: number, target: THREE.Vector3) => {
      const x = (u - 0.5) * 10; // -5 to 5
      const z = (v - 0.5) * 10; // -5 to 5
      const y = mathModels[type].fn(x, z);
      target.set(x, y, z);
    }, 50, 50);
  }, [type]);

  const matColor = type === "bowl" ? "#8b5cf6" : type === "hills" ? "#f472b6" : "#06b6d4";

  return (
    <mesh geometry={geometry} position={[0, -1, 0]}>
      <meshStandardMaterial 
        color={matColor} 
        wireframe={true} 
        transparent 
        opacity={0.3} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Agent Physics Component ─── */
function AgentBall({ positionArr, type }: { positionArr: [number, number][], type: Topography }) {
  const ballRef = useRef<THREE.Mesh>(null!);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (positionArr.length <= 1) {
      if (ballRef.current && positionArr[0]) {
        const [x, z] = positionArr[0];
        ballRef.current.position.set(x, mathModels[type].fn(x, z) - 1 + 0.15, z);
        setCurrentIdx(0);
      }
      return;
    }

    const dummy = { progress: 0 };
    const maxIdx = positionArr.length - 1;

    gsap.to(dummy, {
      progress: 1,
      duration: Math.min(positionArr.length * 0.05, 5), // Dynamic speed
      ease: "power1.inOut",
      onUpdate: () => {
         const floatIdx = dummy.progress * maxIdx;
         const idxFloor = Math.floor(floatIdx);
         const idxCeil = Math.min(idxFloor + 1, maxIdx);
         const interp = floatIdx - idxFloor;

         const p1 = positionArr[idxFloor];
         const p2 = positionArr[idxCeil];
         
         const x = p1[0] + (p2[0] - p1[0]) * interp;
         const z = p1[1] + (p2[1] - p1[1]) * interp;
         
         if (ballRef.current) {
             ballRef.current.position.set(x, mathModels[type].fn(x, z) - 1 + 0.15, z);
         }
         setCurrentIdx(Math.round(floatIdx));
      }
    });

    return () => { gsap.killTweensOf(dummy); };
  }, [positionArr, type]);

  const currentPos = positionArr[currentIdx] || positionArr[0];

  return (
    <group>
      {/* Path Line */}
      {positionArr.length > 1 && (
         <line>
           <bufferGeometry attach="geometry" {...(() => {
              const geom = new THREE.BufferGeometry();
              const pts = positionArr.map(p => new THREE.Vector3(p[0], mathModels[type].fn(p[0], p[1]) - 1 + 0.05, p[1]));
              geom.setFromPoints(pts);
              return geom;
           })()} />
           <lineBasicMaterial attach="material" color="#ffffff" opacity={0.5} transparent linewidth={2} />
         </line>
      )}

      {/* The Agent */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.5} />
        
        {currentPos && (
            <Html position={[0, 0.4, 0]} center className="pointer-events-none z-50">
              <div className="bg-background/80 backdrop-blur-md border border-primary/30 px-2 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap shadow-xl">
                Loss: {mathModels[type].fn(currentPos[0], currentPos[1]).toFixed(3)}
              </div>
            </Html>
        )}
      </mesh>
    </group>
  );
}

export default function GradientDescentSimulator() {
  const [topo, setTopo] = useState<Topography>("hills");
  const [useMomentum, setUseMomentum] = useState(false);
  const [learningRate, setLearningRate] = useState(0.15);
  const [isRunning, setIsRunning] = useState(false);
  
  // Starting coordinate logic based on topography
  const getStartPos = (t: Topography): [number, number] => {
      switch(t) {
         case "bowl": return [4, 4];
         case "hills": return [3.5, 3.5];
         case "saddle": return [0.1, 4]; // slightly offset so it rolls
      }
  };

  const [history, setHistory] = useState<[number, number][]>([getStartPos("hills")]);

  useEffect(() => {
      reset(topo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topo]); // Handle swapping without blowing up rules

  const runDescent = () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const tempHistory: [number, number][] = [getStartPos(topo)];
    let currX = tempHistory[0][0];
    let currZ = tempHistory[0][1];
    
    // Momentum vars
    let velocityX = 0;
    let velocityZ = 0;
    const gamma = 0.9; // Friction
    
    for (let step = 0; step < 200; step++) {
       const gx = mathModels[topo].gradX(currX);
       const gz = mathModels[topo].gradZ(currZ);
       
       if (useMomentum) {
           velocityX = gamma * velocityX + learningRate * gx;
           velocityZ = gamma * velocityZ + learningRate * gz;
           currX -= velocityX;
           currZ -= velocityZ;
       } else {
           currX -= learningRate * gx;
           currZ -= learningRate * gz;
       }
       
       // Clamp to bounding box [-5, 5]
       currX = Math.max(-5, Math.min(5, currX));
       currZ = Math.max(-5, Math.min(5, currZ));
       
       tempHistory.push([currX, currZ]);
       
       // Stop if practically not moving anymore
       if (Math.abs(currX - tempHistory[step][0]) < 0.0001 && Math.abs(currZ - tempHistory[step][1]) < 0.0001) {
           break;
       }
    }
    
    setHistory(tempHistory);
    
    setTimeout(() => {
        setIsRunning(false);
    }, Math.min(tempHistory.length * 0.05, 5) * 1000 + 500);
  };

  const reset = (t: Topography = topo) => {
    setIsRunning(false);
    setHistory([getStartPos(t)]);
  };

  return (
    <div className="space-y-6">
      {/* 3D Visualizer Canvas */}
      <div className="sim-stage rounded-2xl h-[400px] overflow-hidden relative">
        <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <LandscapeSurface type={topo} />
          <AgentBall positionArr={history} type={topo} />

          <OrbitControls 
            enableZoom={true} 
            maxDistance={15} 
            minDistance={2} 
            autoRotate={!isRunning} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>

        {/* Overlay Overlay Info */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 text-xs font-mono">
            <div className="glass px-3 py-1.5 rounded-lg border border-white/10 text-white flex gap-2">
                <span className="text-muted">Algorithm:</span> 
                {useMomentum ? <span className="text-accent font-bold tracking-tight">ADAM (Momentum)</span> : <span className="text-neon-pink font-bold tracking-tight">Standard SGD</span>}
            </div>
            <div className="glass px-3 py-1.5 rounded-lg border border-white/10 text-white flex gap-2">
                <span className="text-muted">Landscape:</span> 
                <span className="capitalize">{topo}</span>
            </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="sim-control-panel grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl">
        
        <div className="space-y-6">
            <div>
              <h4 className="sim-section-title mb-3">Topography Challenge</h4>
              <div className="flex bg-background/50 p-1 rounded-lg">
                {(["bowl", "hills", "saddle"] as Topography[]).map((t) => (
                  <button
                    key={t}
                    disabled={isRunning}
                    onClick={() => { setTopo(t); }}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                      topo === t ? "bg-primary text-white shadow-lg" : "text-muted hover:text-white pointer-events-auto"
                    } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted font-medium">Learning Rate (Step Size)</span>
                <span className="text-white font-mono">{learningRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                disabled={isRunning}
                className="w-full accent-primary pointer-events-auto disabled:opacity-50 cursor-pointer"
              />
            </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
           <div>
              <h4 className="sim-section-title mb-3">Physics Engine</h4>
              <button 
                  disabled={isRunning}
                  onClick={() => setUseMomentum(!useMomentum)}
                  className={`w-full py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-bold ${
                      useMomentum ? "border-accent bg-accent/20 text-accent shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "border-white/10 text-muted hover:border-white/30"
                  } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                  <Activity className="w-4 h-4" />
                  Apply Momentum Velocity
              </button>
              <p className="sim-note mt-2">
                  Momentum builds velocity as it moves downhill, which helps the optimizer escape shallow local traps. Compare it with standard SGD on the hills landscape.
              </p>
           </div>
           
           <div className="flex gap-3 mt-auto">
              <button
                onClick={runDescent}
                disabled={isRunning}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary/20 pointer-events-auto"
              >
                <Play className="w-4 h-4" /> {isRunning ? "Calculating..." : "Run Descent"}
              </button>
              <button
                onClick={() => reset(topo)}
                disabled={isRunning}
                className="sim-icon-button py-3 px-4 rounded-xl disabled:opacity-50 pointer-events-auto"
                title="Reset Position"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
