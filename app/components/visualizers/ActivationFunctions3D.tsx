"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";

type FunctionType = "sigmoid" | "tanh" | "relu";

function MathCurve({ funcType, inputValue }: { funcType: FunctionType; inputValue: number }) {
  const lineRef = useRef<any>(null);
  const pointRef = useRef<THREE.Mesh>(null);

  // Generate points for the curve
  const points = useMemo(() => {
    const pts = [];
    for (let x = -5; x <= 5; x += 0.1) {
      let y = 0;
      if (funcType === "sigmoid") y = 1 / (1 + Math.exp(-x));
      else if (funcType === "tanh") y = Math.tanh(x);
      else if (funcType === "relu") y = Math.max(0, x);
      
      // Center the graph vertically a bit for aesthetics depending on the function
      let yOffset = 0;
      if (funcType === "sigmoid") yOffset = -0.5;
      else if (funcType === "relu") yOffset = -2;
      
      pts.push(new THREE.Vector3(x, y + yOffset, 0));
    }
    return pts;
  }, [funcType]);

  const color = funcType === "sigmoid" ? "#8b5cf6" : funcType === "tanh" ? "#06b6d4" : "#f472b6";

  // Calculate the y value for the current input
  let currentY = 0;
  if (funcType === "sigmoid") currentY = 1 / (1 + Math.exp(-inputValue));
  else if (funcType === "tanh") currentY = Math.tanh(inputValue);
  else if (funcType === "relu") currentY = Math.max(0, inputValue);

  let yOffset = 0;
  if (funcType === "sigmoid") yOffset = -0.5;
  else if (funcType === "relu") yOffset = -2;

  useFrame(() => {
    if (pointRef.current) {
      // Lerp point to new position
      pointRef.current.position.lerp(new THREE.Vector3(inputValue, currentY + yOffset, 0), 0.1);
    }
  });

  return (
    <group>
      {/* Grid Lines */}
      <Line points={[[-5, yOffset, 0], [5, yOffset, 0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      <Line points={[[0, -3, 0], [0, 3, 0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      
      {/* Function Curve */}
      <Line ref={lineRef} points={points} color={color} lineWidth={4} />
      
      {/* Active Point */}
      <mesh ref={pointRef} position={[inputValue, currentY + yOffset, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      
      <Html position={[0, -3.5, 0]} center>
        <div className="text-white font-mono text-xs opacity-50">X / Y Axis</div>
      </Html>
    </group>
  );
}

export default function ActivationFunctions3D() {
  const [funcType, setFuncType] = useState<FunctionType>("sigmoid");
  const [inputValue, setInputValue] = useState<number>(0);

  let currentY = 0;
  if (funcType === "sigmoid") currentY = 1 / (1 + Math.exp(-inputValue));
  else if (funcType === "tanh") currentY = Math.tanh(inputValue);
  else if (funcType === "relu") currentY = Math.max(0, inputValue);

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
           onClick={() => setFuncType("sigmoid")}
           className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${funcType === "sigmoid" ? "bg-primary text-white" : "bg-surface border border-white/10 text-muted hover:text-white"}`}
        >
          Sigmoid
        </button>
        <button 
           onClick={() => setFuncType("tanh")}
           className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${funcType === "tanh" ? "bg-accent text-white" : "bg-surface border border-white/10 text-muted hover:text-white"}`}
        >
          Tanh
        </button>
        <button 
           onClick={() => setFuncType("relu")}
           className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${funcType === "relu" ? "bg-neon-pink text-white" : "bg-surface border border-white/10 text-muted hover:text-white"}`}
        >
          ReLU
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-3/4 glass p-4 rounded-xl border border-white/10">
        <div className="flex justify-between text-xs font-mono mb-2">
           <span className="text-muted">Input (X): <span className="text-white font-bold">{inputValue.toFixed(2)}</span></span>
           <span className="text-muted">Output (Y): <span className="text-accent font-bold">{currentY.toFixed(4)}</span></span>
        </div>
        <input 
           type="range" 
           min="-5" max="5" step="0.1" 
           value={inputValue} 
           onChange={(e) => setInputValue(parseFloat(e.target.value))}
           className="w-full accent-primary"
        />
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <MathCurve funcType={funcType} inputValue={inputValue} />
        
        <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
