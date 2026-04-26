"use client";

import { useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";

// Generate synthetic data that roughly follows y = 0.5x + 1
const generateData = () => {
  const pts = [];
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 8; // -4 to 4
    const noise = (Math.random() - 0.5) * 2;
    const y = 0.5 * x + 1 + noise;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  return pts;
};

function RegressionScene({ progress }: { progress: number }) {
  const points = useMemo(() => generateData(), []);
  const lineRef = useRef<any>(null);
  
  // Starting parameters (bad fit)
  const startM = -1.5;
  const startB = -3;
  
  // Ending parameters (good fit approx y = 0.5x + 1)
  const endM = 0.5;
  const endB = 1;
  
  // Current parameters based on progress (0 to 1)
  // Use ease-out for realistic learning curve look
  const easeOutProgress = 1 - Math.pow(1 - progress, 3);
  const currentM = startM + (endM - startM) * easeOutProgress;
  const currentB = startB + (endB - startB) * easeOutProgress;

  // Calculate line endpoints based on current slope and intercept
  const lineStart = new THREE.Vector3(-5, currentM * -5 + currentB, 0);
  const lineEnd = new THREE.Vector3(5, currentM * 5 + currentB, 0);
  
  // Calculate Mean Squared Error
  const mse = useMemo(() => {
    let sum = 0;
    points.forEach(p => {
      const predY = currentM * p.x + currentB;
      sum += Math.pow(p.y - predY, 2);
    });
    return sum / points.length;
  }, [points, currentM, currentB]);

  return (
    <group>
      {/* Grid */}
      <Line points={[[-5, 0, 0], [5, 0, 0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      <Line points={[[0, -5, 0], [0, 5, 0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      
      {/* Data Points */}
      {points.map((p, i) => (
        <group key={i}>
          <mesh position={p}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
          </mesh>
          {/* Error Lines (Residuals) */}
          <Line points={[p, new THREE.Vector3(p.x, currentM * p.x + currentB, 0)]} color="#ef4444" opacity={0.4} transparent lineWidth={1} />
        </group>
      ))}

      {/* Regression Line */}
      <Line ref={lineRef} points={[lineStart, lineEnd]} color="#f59e0b" lineWidth={4} />
      
      <Html position={[-4.5, 4.5, 0]} className="pointer-events-none">
         <div className="glass px-2 py-1 rounded text-xs font-mono border border-white/10 text-white whitespace-nowrap">
            Error (MSE): <span className="text-red-400 font-bold">{mse.toFixed(2)}</span>
         </div>
      </Html>
    </group>
  );
}

export default function RegressionLine3D() {
  const [epoch, setEpoch] = useState<number>(0);

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-4 right-4 z-10 glass px-3 py-2 rounded-lg border border-white/10 text-right">
        <div className="text-[10px] text-muted font-mono uppercase tracking-widest">Gradient Descent</div>
        <div className="text-white text-sm font-bold">Epoch: {epoch}</div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-3/4 glass p-4 rounded-xl border border-white/10 flex items-center gap-4">
        <button 
           onClick={() => setEpoch(0)}
           className="px-3 py-1.5 bg-surface border border-white/10 rounded text-xs text-white hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
        <input 
           type="range" 
           min="0" max="100" step="1" 
           value={epoch} 
           onChange={(e) => setEpoch(parseInt(e.target.value))}
           className="w-full accent-primary"
        />
        <button 
           onClick={() => setEpoch(100)}
           className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/80 transition-colors"
        >
          Train
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RegressionScene progress={epoch / 100} />
        <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
