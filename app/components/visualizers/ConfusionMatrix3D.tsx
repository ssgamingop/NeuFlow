"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, RoundedBox } from "@react-three/drei";

function MatrixBlock({ pos, color, label, count, description }: { pos: [number, number, number], color: string, label: string, count: number, description: string }) {
  return (
    <group position={pos}>
      <RoundedBox args={[2.5, 2.5, 0.5]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} opacity={0.9} transparent />
      </RoundedBox>
      <Html position={[0, 0, 0.3]} center className="pointer-events-none w-[120px] text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="text-[10px] font-mono text-white/70 tracking-widest uppercase">{label}</div>
          <div className="text-3xl font-bold text-white drop-shadow-md my-1">{count}</div>
          <div className="text-[8px] text-white/50 leading-tight">{description}</div>
        </div>
      </Html>
    </group>
  );
}

export default function ConfusionMatrix3D() {
  const [threshold, setThreshold] = useState<number>(0.5);

  // Simulate total 1000 patients: 100 sick (Positive), 900 healthy (Negative)
  // As threshold lowers, model flags more people as Sick.
  // This increases True Positives (good) but skyrockets False Positives (bad).
  
  const baseSickFound = 100 * (1 - threshold); 
  const tp = Math.round(baseSickFound);
  const fn = 100 - tp;
  
  const baseHealthyFlagged = 900 * Math.pow((1 - threshold), 3); // non-linear false alarm rate
  const fp = Math.round(baseHealthyFlagged);
  const tn = 900 - fp;

  // Calculate Metrics
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp / (tp + fn);
  const accuracy = (tp + tn) / 1000;

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-4 left-4 z-10 glass p-3 rounded-lg border border-white/10 w-48">
        <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-2">Metrics</div>
        <div className="flex justify-between items-center mb-1">
           <span className="text-xs text-white/70">Accuracy</span>
           <span className="text-sm font-bold text-white">{(accuracy * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center mb-1">
           <span className="text-xs text-white/70">Precision</span>
           <span className="text-sm font-bold text-blue-400">{(precision * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="text-xs text-white/70">Recall</span>
           <span className="text-sm font-bold text-green-400">{(recall * 100).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-3/4 glass p-4 rounded-xl border border-white/10 text-center">
        <div className="text-xs text-white mb-2">
           Detection Threshold: <span className="font-bold text-accent">{threshold.toFixed(2)}</span>
        </div>
        <input 
           type="range" 
           min="0.1" max="0.9" step="0.05" 
           value={threshold} 
           onChange={(e) => setThreshold(parseFloat(e.target.value))}
           className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted mt-1 px-1">
          <span>Flag Everyone (High Recall)</span>
          <span>Be Conservative (High Precision)</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <group position={[0, 0.5, 0]}>
           {/* Top Row: Actual Sick */}
           <MatrixBlock pos={[-1.4, 1.4, 0]} color="#10b981" label="True Positive" count={tp} description="Sick & Detected" />
           <MatrixBlock pos={[1.4, 1.4, 0]} color="#f43f5e" label="False Negative" count={fn} description="Sick but Missed!" />
           
           {/* Bottom Row: Actual Healthy */}
           <MatrixBlock pos={[-1.4, -1.4, 0]} color="#eab308" label="False Positive" count={fp} description="Healthy but False Alarm" />
           <MatrixBlock pos={[1.4, -1.4, 0]} color="#3b82f6" label="True Negative" count={tn} description="Healthy & Cleared" />
        </group>
        
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/4} />
      </Canvas>
    </div>
  );
}
