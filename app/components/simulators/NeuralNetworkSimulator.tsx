"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, RotateCcw, Crosshair } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

/* ─── Neural Network Core Math ─── */
function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}
function sigmoidDerivative(x: number) {
  return x * (1 - x); // Assuming x is already sigmoid activated
}

interface NodeData {
  id: string;
  layerIdx: number;
  nodeIdx: number;
  position: THREE.Vector3;
  value: number;
  bias: number;
  delta?: number;
}

interface ConnectionData {
  id: string;
  fromId: string;
  toId: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  weight: number;
  layer: number;
}

/* ─── 3D Network Components ─── */
function NodeMesh({ data, isActive, isBackprop }: { data: NodeData, isActive: boolean, isBackprop: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
     if (haloRef.current) {
        // Continuous gentle pulse, aggressive when active
        const intensity = isActive ? 0.2 : 0.05;
        const speed = isActive ? 6 : 2;
        haloRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * speed + data.layerIdx) * intensity);
     }
  });

  // Green color for backprop, Purple/Cyan for forward
  const color = isBackprop ? "#4ade80" : (data.layerIdx === 0 ? "#8b5cf6" : "#06b6d4");

  return (
    <group position={data.position}>
        <mesh ref={meshRef}>
           <sphereGeometry args={[0.2, 16, 16]} />
           <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 1.5 : 0.4} />
        </mesh>
        
        <mesh ref={haloRef} visible={isActive}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>

        <Html position={[0, 0.4, 0]} center className="pointer-events-none">
            <div className={`bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap transition-all ${isActive ? 'border-primary ring-1 ring-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'border-white/10'}`}>
               {!isBackprop 
                 ? `${data.layerIdx === 0 ? "In" : "Out"}: ${data.value.toFixed(2)}`
                 : `δ: ${data.delta?.toFixed(3) || "0.000"} `
               }
            </div>
        </Html>
    </group>
  );
}

function ConnectionLine({ data, isActive, isBackprop }: { data: ConnectionData, isActive: boolean, isBackprop: boolean }) {
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints([data.start, data.end]), [data.start, data.end]);
  const pulseRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
      if (isActive && pulseRef.current) {
         // Travelling pulse logic relative to layer and time
         const t = (state.clock.elapsedTime * 1.5 + data.layer) % 1; 
         // If backprop, travel backwards!
         const progress = isBackprop ? (1 - t) : t;
         pulseRef.current.position.copy(data.start).lerp(data.end, progress);
      }
  });

  // Pink negative, Cyan positive. Green during backprop adjustment.
  const color = isBackprop && isActive ? "#4ade80" : (data.weight > 0 ? "#22d3ee" : "#f472b6");
  const opacity = isActive ? 1 : Math.max(0.15, Math.abs(data.weight) * 0.5);

  return (
    <group>
      {/* @ts-expect-error - React DOM typings incorrectly override R3F line intrinsic */}
      <line geometry={geom}>
         <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={isActive ? 3 : 1} />
      </line>
      
      {/* Travelling Energy Pulse */}
      {isActive && (
         <mesh ref={pulseRef}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
         </mesh>
      )}

      {isBackprop && isActive && (
          <Html position={data.start.clone().lerp(data.end, 0.5)} center className="pointer-events-none z-50">
             <div className="bg-green-900/90 text-green-400 border border-green-500/30 px-1 py-0.5 rounded text-[8px] font-bold">
               Updating Weight
             </div>
          </Html>
      )}
    </group>
  );
}

export default function NeuralNetworkSimulator() {
  const [layers, setLayers] = useState([2, 3, 2, 1]);
  const [isRunning, setIsRunning] = useState(false);
  const [isBackpropMode, setIsBackpropMode] = useState(false);
  
  const [input1, setInput1] = useState(0.8);
  const [input2, setInput2] = useState(0.2);
  const [targetOutput, setTargetOutput] = useState(1.0);
  
  const [output, setOutput] = useState("0.000");
  const [mseLoss, setMseLoss] = useState("0.000");
  
  const [activeLayer, setActiveLayer] = useState(-1);

  // Network State
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  
  const buildNetwork = useCallback((i1: number, i2: number, lLayers: number[]) => {
    const newNodes: NodeData[] = [];
    const newConns: ConnectionData[] = [];
    
    lLayers.forEach((count, layerIdx) => {
        const z = -4 + (layerIdx / (lLayers.length - 1)) * 8;
        
        for (let i = 0; i < count; i++) {
           const x = (i - (count - 1) / 2) * 1.5; 
           newNodes.push({
               id: `${layerIdx}-${i}`,
               layerIdx,
               nodeIdx: i,
               position: new THREE.Vector3(x, 0, z),
               value: layerIdx === 0 ? (i === 0 ? i1 : i2) : 0,
               bias: Math.random() * 0.5 - 0.25,
               delta: 0
           });
        }
    });

    const getNodesLayers = (idx: number) => newNodes.filter(n => n.layerIdx === idx);
    
    for (let l = 0; l < lLayers.length - 1; l++) {
        const fromLayer = getNodesLayers(l);
        const toLayer = getNodesLayers(l + 1);
        
        fromLayer.forEach((fn) => {
            toLayer.forEach((tn) => {
                newConns.push({
                    id: `${fn.id}->${tn.id}`,
                    fromId: fn.id,
                    toId: tn.id,
                    start: fn.position,
                    end: tn.position,
                    weight: Math.random() * 2 - 1,
                    layer: l
                });
            });
        });
    }
    
    return { n: newNodes, c: newConns };
  }, []);

  useEffect(() => {
    const { n, c } = buildNetwork(input1, input2, layers);
    setNodes(n);
    setConnections(c);
    setOutput("0.000");
    setMseLoss("0.000");
  }, [layers, input1, input2, targetOutput, buildNetwork]);

  const runTrainingPass = () => {
      if (isRunning) return;
      setIsRunning(true);
      setIsBackpropMode(false);
      setActiveLayer(0);

      // --- Forward Pass Calculation ---
      let currentNodes = JSON.parse(JSON.stringify(nodes)) as NodeData[];
      let currentConns = JSON.parse(JSON.stringify(connections)) as ConnectionData[];

      // Re-map Vector3s after JSON stringify
      currentNodes.forEach(n => n.position = new THREE.Vector3(n.position.x, n.position.y, n.position.z));
      currentConns.forEach(c => {
         c.start = new THREE.Vector3(c.start.x, c.start.y, c.start.z);
         c.end = new THREE.Vector3(c.end.x, c.end.y, c.end.z);
      });

      for (let l = 1; l < layers.length; l++) {
          const prevLayer = currentNodes.filter(n => n.layerIdx === l - 1);
          const currLayer = currentNodes.filter(n => n.layerIdx === l);
          
          currLayer.forEach(node => {
              let sum = node.bias;
              prevLayer.forEach(prevNode => {
                  const conn = currentConns.find(c => c.fromId === prevNode.id && c.toId === node.id);
                  if (conn) sum += prevNode.value * conn.weight;
              });
              node.value = sigmoid(sum);
          });
      }

      // Calculate the final error
      const finalOut = currentNodes.filter(n => n.layerIdx === layers.length - 1)[0].value;
      const error = 0.5 * Math.pow(targetOutput - finalOut, 2);

      // Visual Forward Pass Timeline
      const tl = gsap.timeline();

      for (let l = 1; l <= layers.length; l++) {
          tl.to({}, {
              duration: 0.6,
              onStart: () => {
                  setActiveLayer(l);
                  if (l === layers.length) {
                      setNodes(currentNodes);
                      setOutput(finalOut.toFixed(4));
                      setMseLoss(error.toFixed(4));
                  }
              }
          });
      }

      // --- Backward Pass Calculation (Backpropagation) ---
      tl.to({}, {
          duration: 1.0, // Pause before triggering backprop
          onStart: () => {
             setIsBackpropMode(true);
             setActiveLayer(layers.length - 1);
          }
      });

      // Calculate deltas from output to first hidden layer
      for (let l = layers.length - 1; l > 0; l--) {
         const currLayer = currentNodes.filter(n => n.layerIdx === l);
         const prevLayer = currentNodes.filter(n => n.layerIdx === l - 1);

         currLayer.forEach(node => {
            if (l === layers.length - 1) {
               // Output node delta
               node.delta = (node.value - targetOutput) * sigmoidDerivative(node.value);
            } else {
               // Hidden node delta
               let errorSum = 0;
               const nextLayer = currentNodes.filter(n => n.layerIdx === l + 1);
               nextLayer.forEach(nextNode => {
                  const conn = currentConns.find(c => c.fromId === node.id && c.toId === nextNode.id);
                  if (conn && nextNode.delta !== undefined) {
                     errorSum += conn.weight * nextNode.delta;
                  }
               });
               node.delta = errorSum * sigmoidDerivative(node.value);
            }

            // Adjust weights connecting *into* this node
            const learningRate = 0.5;
            prevLayer.forEach(prevNode => {
                const conn = currentConns.find(c => c.fromId === prevNode.id && c.toId === node.id);
                if (conn) {
                    conn.weight -= learningRate * (node.delta || 0) * prevNode.value;
                }
            });
         });

         // Visual staggering parameter backflow
         tl.to({}, {
             duration: 0.8,
             onStart: () => {
                 setActiveLayer(l - 1);
                 setNodes([...currentNodes]);
                 setConnections([...currentConns]);
             }
         });
      }

      tl.to({}, {
          duration: 0.5,
          onComplete: () => {
              setActiveLayer(-1);
              setIsRunning(false);
              setIsBackpropMode(false);
          }
      });
  };

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <div className="sim-stage rounded-2xl h-[450px] overflow-hidden relative">
        <Canvas camera={{ position: [5, 4, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <group position={[0, -0.5, 0]}>
              {connections.map((c) => (
                <ConnectionLine 
                   key={c.id} 
                   data={c} 
                   isActive={!isBackpropMode ? (c.layer === activeLayer - 1) : (c.layer === activeLayer)} 
                   isBackprop={isBackpropMode} 
                />
              ))}
              
              {nodes.map((n) => (
                <NodeMesh 
                   key={n.id} 
                   data={n} 
                   isActive={n.layerIdx === activeLayer} 
                   isBackprop={isBackpropMode}
                />
              ))}
          </group>

          <OrbitControls 
            enableZoom={false} 
            maxDistance={15} 
            minDistance={2} 
            autoRotate={!isRunning} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>

        {/* Dynamic State Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 w-48">
            <div className="glass p-3 rounded-lg border border-white/10 shadow-lg">
                <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-1">Target Output</div>
                <div className="text-xl font-bold font-mono text-neon-pink">{targetOutput.toFixed(2)}</div>
                
                <div className="text-[10px] text-muted font-mono uppercase tracking-widest mt-3 mb-1">Network Guess</div>
                <div className={`text-xl font-bold font-mono transition-colors ${isBackpropMode ? 'text-white' : 'text-primary'}`}>{output}</div>
                
                <div className="w-full h-px bg-white/10 my-3" />
                
                <div className="text-[10px] text-muted font-mono uppercase tracking-widest flex items-center justify-between mb-1">
                    MSE Loss 
                    {isBackpropMode && <span className="text-[9px] text-green-400 animate-pulse">Minimizing...</span>}
                </div>
                <div className="text-2xl font-bold font-mono text-accent">{mseLoss}</div>
            </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="sim-control-panel grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl">
        <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted font-medium">Input 1 Sensor</span>
                <span className="text-white font-mono">{input1.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={input1} onChange={(e) => setInput1(parseFloat(e.target.value))} disabled={isRunning} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted font-medium">Input 2 Sensor</span>
                <span className="text-white font-mono">{input2.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={input2} onChange={(e) => setInput2(parseFloat(e.target.value))} disabled={isRunning} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neon-pink font-bold flex items-center gap-1"><Crosshair className="w-4 h-4"/> Target Requirement</span>
                <span className="text-white font-mono">{targetOutput.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={targetOutput} onChange={(e) => setTargetOutput(parseFloat(e.target.value))} disabled={isRunning} className="w-full accent-neon-pink" />
            </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
           <div>
              <h4 className="sim-section-title mb-3">Model Architecture</h4>
              {/* Architecture Editor omitted logic bounds for clarity */}
              <div className="flex bg-background/50 p-2 rounded-lg justify-between items-center px-4">
                  <span className="text-xs font-mono text-muted">INPUT</span>
                  <span className="text-white font-bold">{layers[0]}</span>
                  <span className="text-xs font-mono text-muted">HIDDEN 1</span>
                  <span className="text-white font-bold">{layers[1]}</span>
                  <span className="text-xs font-mono text-muted">HIDDEN 2</span>
                  <span className="text-white font-bold">{layers[2]}</span>
                  <span className="text-xs font-mono text-muted">OUT</span>
                  <span className="text-white font-bold">{layers[3]}</span>
              </div>
              <p className="sim-note mt-4">
                  A training pass runs <span className="text-accent font-bold">forward propagation</span>, compares the guess with the target, then sends error deltas backward with <span className="text-green-400 font-bold">backpropagation</span> to update connection weights.
              </p>
           </div>
           
           <div className="flex gap-3 mt-auto">
              <button
                onClick={runTrainingPass}
                disabled={isRunning}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)] pointer-events-auto"
              >
                <Play className="w-4 h-4" /> {isRunning ? (isBackpropMode ? "Backpropagating..." : "Forward Pass...") : "Execute Training Pass"}
              </button>
              <button
                onClick={() => setLayers([...layers])} // Force rebuild
                disabled={isRunning}
                className="sim-icon-button py-3 px-4 rounded-xl disabled:opacity-50 pointer-events-auto"
                title="Reset Weights"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
