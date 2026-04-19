"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, RotateCcw, Plus, Minus } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

/* ─── Neural Network Core Math ─── */
function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

interface NodeData {
  id: string;
  layerIdx: number;
  nodeIdx: number;
  position: THREE.Vector3;
  value: number;
  bias: number;
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
function NodeMesh({ data, isActive }: { data: NodeData, isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
     if (isActive && haloRef.current) {
        haloRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.2);
     }
  });

  const color = data.layerIdx === 0 ? "#8b5cf6" : "#06b6d4";

  return (
    <group position={data.position}>
        {/* Core */}
        <mesh ref={meshRef} className="nn-node">
           <sphereGeometry args={[0.2, 16, 16]} />
           <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 1.5 : 0.4} />
        </mesh>
        
        {/* Halo */}
        <mesh ref={haloRef} visible={isActive}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>

        <Html position={[0, 0.4, 0]} center className="pointer-events-none">
            <div className={`bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap transition-all ${isActive ? 'border-primary ring-1 ring-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'border-white/10'}`}>
               {data.layerIdx === 0 ? "In" : "Out"}: {data.value.toFixed(2)}
            </div>
        </Html>
    </group>
  );
}

function ConnectionLine({ data, isActive }: { data: ConnectionData, isActive: boolean }) {
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints([data.start, data.end]), [data.start, data.end]);
  
  // Color based on weight: Positive=Cyan, Negative=Pink
  const color = data.weight > 0 ? "#22d3ee" : "#f472b6";
  const opacity = isActive ? 0.8 : (0.1 + Math.abs(data.weight) * 0.2);

  return (
    <line geometry={geom}>
       <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={isActive ? 3 : 1} />
    </line>
  );
}

/* ─── Simulator Application ─── */
export default function NeuralNetworkSimulator() {
  const [layers, setLayers] = useState([2, 3, 2, 1]);
  const [isRunning, setIsRunning] = useState(false);
  const [input1, setInput1] = useState(0.7);
  const [input2, setInput2] = useState(0.3);
  const [output, setOutput] = useState("0.0000");
  const [activeLayer, setActiveLayer] = useState(-1);

  // Network State
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  
  // Track pulses for GSAP animation
  const pulsesGroupRef = useRef<THREE.Group>(null!);

  const buildNetwork = useCallback((i1: number, i2: number, lLayers: number[]) => {
    const newNodes: NodeData[] = [];
    const newConns: ConnectionData[] = [];
    
    // Z-axis spreading for layers (-4 to 4)
    lLayers.forEach((count, layerIdx) => {
        const z = -4 + (layerIdx / (lLayers.length - 1)) * 8;
        
        for (let i = 0; i < count; i++) {
           const x = (i - (count - 1) / 2) * 1.5; // Center X
           const y = 0; // Keeping it mostly flat on Y, or we can use random jitter
           
           newNodes.push({
               id: `${layerIdx}-${i}`,
               layerIdx,
               nodeIdx: i,
               position: new THREE.Vector3(x, y, z),
               value: layerIdx === 0 ? (i === 0 ? i1 : i2) : 0,
               bias: Math.random() * 0.5 - 0.25
           });
        }
    });

    // Connections
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
    setOutput("0.0000"); // Reset output on rebuild
  }, [layers, input1, input2, buildNetwork]);

  const runForwardPass = () => {
      if (isRunning || !pulsesGroupRef.current) return;
      setIsRunning(true);
      setActiveLayer(0);

      // We clone nodes to calculate math sequentially
      const calculatedNodes = [...nodes.map(n => ({ ...n }))];
      
      const tl = gsap.timeline({
          onComplete: () => {
             setIsRunning(false);
             setActiveLayer(-1);
             const finalNode = calculatedNodes.find(n => n.layerIdx === layers.length - 1);
             if (finalNode) setOutput(finalNode.value.toFixed(4));
          }
      });

      for (let l = 0; l < layers.length - 1; l++) {
         const layerConns = connections.filter(c => c.layer === l);
         
         // Mathematical propagation for this layer step
         layerConns.forEach(conn => {
             const fromNode = calculatedNodes.find(n => n.id === conn.fromId)!;
             const toNode = calculatedNodes.find(n => n.id === conn.toId)!;
             toNode.value += fromNode.value * conn.weight;
         });
         
         // Apply activation (Sigmoid)
         calculatedNodes.filter(n => n.layerIdx === l + 1).forEach(toNode => {
             toNode.value = sigmoid(toNode.value + toNode.bias);
         });

         // GSAP Visual Animation for Layer `l`
         tl.call(() => setActiveLayer(l));

         // Animate glowing spheres along the connections using raw GSAP on mesh positions
         layerConns.forEach(conn => {
             // Create a temporary mesh in the scene for the pulse
             const geometry = new THREE.SphereGeometry(0.08, 8, 8);
             const material = new THREE.MeshBasicMaterial({ color: "#22d3ee" });
             const pulseMesh = new THREE.Mesh(geometry, material);
             pulseMesh.position.copy(conn.start);
             
             pulsesGroupRef.current.add(pulseMesh);
             
             tl.to(pulseMesh.position, {
                 x: conn.end.x,
                 y: conn.end.y,
                 z: conn.end.z,
                 duration: 0.6,
                 ease: "power2.inOut",
                 onComplete: () => { pulseMesh.parent?.remove(pulseMesh); }
             }, `<`); // start all pulses of this layer simultaneously
         });
         
         // Small delay at node arrival before next layer fires
         tl.call(() => {
             setNodes(calculatedNodes.map(n => ({...n}))); // Trigger React UI render for the new values
         });
         tl.to({}, { duration: 0.2 }); // tiny stall
      }
  };

  const addHiddenNeuron = () => {
    if (isRunning) return;
    if (layers.length < 5) {
      setLayers([...layers.slice(0, -1), 2, layers[layers.length - 1]]);
    } else {
      const newLayers = [...layers];
      const midIdx = Math.floor(newLayers.length / 2);
      if (newLayers[midIdx] < 5) {
        newLayers[midIdx]++;
        setLayers(newLayers);
      }
    }
  };

  const removeHiddenNeuron = () => {
    if (isRunning) return;
    if (layers.length > 3) {
      const newLayers = [...layers];
      const midIdx = Math.floor(newLayers.length / 2);
      if (newLayers[midIdx] > 1) {
        newLayers[midIdx]--;
      } else {
        newLayers.splice(midIdx, 1);
      }
      setLayers(newLayers);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <div className="glass rounded-2xl h-[400px] overflow-hidden relative border border-primary/20">
         <Canvas camera={{ position: [6, 4, 0], fov: 45 }}>
            <fog attach="fog" args={["#0a0a1f", 5, 20]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} color="#8b5cf6" />
            <Stars radius={10} depth={50} count={500} factor={2} fade speed={1} />
            
            <group rotation={[0, Math.PI / 2, 0]}>
                <Float speed={2} floatIntensity={0.5} rotationIntensity={0.1}>
                    {/* Nodes Loop */}
                    {nodes.map(node => (
                        <NodeMesh key={node.id} data={node} isActive={activeLayer === node.layerIdx || activeLayer + 1 === node.layerIdx} />
                    ))}
                    
                    {/* Connections Loop */}
                    {connections.map(conn => (
                        <ConnectionLine key={conn.id} data={conn} isActive={activeLayer === conn.layer} />
                    ))}
                    
                    {/* GSAP Pulses Container */}
                    <group ref={pulsesGroupRef} />
                </Float>
            </group>

            <OrbitControls autoRotate={!isRunning} autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} enablePan={false} />
         </Canvas>

         <div className="absolute top-4 left-4 pointer-events-none">
            <div className="bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-muted flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               3D Network Architecture
            </div>
         </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-muted mb-2">Input 1</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={input1}
            disabled={isRunning}
            onChange={(e) => setInput1(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-center text-sm font-mono text-primary-light mt-1">
            {input1.toFixed(2)}
          </p>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-muted mb-2">Input 2</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={input2}
            disabled={isRunning}
            onChange={(e) => setInput2(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-center text-sm font-mono text-accent-light mt-1">
            {input2.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Layers</p>
          <p className="text-lg font-mono font-bold text-primary-light">
            {layers.length}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Connections</p>
          <p className="text-lg font-mono font-bold text-accent-light">
            {connections.length}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Final Output</p>
          <p className="text-lg font-mono font-bold text-neon-pink">
            {output}
          </p>
        </div>
      </div>

      {/* Layer controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={removeHiddenNeuron}
          disabled={isRunning || layers.length <= 3}
          className="p-2 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors text-muted disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-sm text-muted font-medium">Hidden Structure</span>
        <button
          onClick={addHiddenNeuron}
          disabled={isRunning}
          className="p-2 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors text-muted disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={runForwardPass}
          disabled={isRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all active:scale-95 ${
            isRunning
              ? "bg-surface-light text-muted cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          }`}
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Calculating..." : "Run Forward Pass"}
        </button>
        <button
          onClick={() => { setOutput("0.0000"); setNodes(buildNetwork(input1, input2, layers).n); }}
          disabled={isRunning}
          className="px-5 py-3 rounded-full glass text-muted font-semibold hover:bg-primary/10 transition-colors disabled:opacity-50 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
