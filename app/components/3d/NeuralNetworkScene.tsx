"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Types and Colors ─── */
interface NodeData {
  id: string;
  position: THREE.Vector3;
  color: string;
  scale: number;
}

interface ConnectionData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  curve: THREE.CubicBezierCurve3;
  pulseSpeed: number;
  pulseOffset: number;
}

const COLORS = {
  input: "#f472b6", // pink
  hidden: "#8b5cf6", // purple
  output: "#06b6d4" // cyan
};

/* ─── Organic Curved Connections ─── */
function CurvedConnection({ data }: { data: ConnectionData }) {
  const lineRef = useRef<THREE.Line>(null!);
  const signalRef = useRef<THREE.Mesh>(null!);

  const lineGeometry = useMemo(() => {
    // Generate organic curved path with 20 points
    const points = data.curve.getPoints(20);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [data.curve]);

  const mat = useMemo(() => new THREE.LineBasicMaterial({ 
    color: data.color, 
    transparent: true, 
    opacity: 0.15,
    blending: THREE.AdditiveBlending 
  }), [data.color]);

  useFrame((state) => {
    // Animate a pulsing datastream along the bezier curve
    const t = state.clock.elapsedTime;
    const progress = ((t * data.pulseSpeed + data.pulseOffset) % 1); // 0 to 1 loop
    
    if (signalRef.current) {
        // Move signal exactly along the 3D curve
        const position = data.curve.getPointAt(progress);
        signalRef.current.position.copy(position);
        
        // Orient signal along the curve's direction
        const tangent = data.curve.getTangentAt(progress);
        signalRef.current.quaternion.setFromUnitVectors(
           new THREE.Vector3(0, 1, 0),
           tangent
        );

        // Fade in and out at the extreme edges
        let opacity = 1;
        if (progress < 0.1) opacity = progress / 0.1;
        if (progress > 0.9) opacity = (1 - progress) / 0.1;
        
        const mat = signalRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = opacity * 0.8;
    }
  });

  return (
    <>
      <line ref={lineRef as any} geometry={lineGeometry} material={mat} />
      
      {/* Traveling Data Pulse (Elongated shape to look like a beam) */}
      <mesh ref={signalRef}>
          <capsuleGeometry args={[0.015, 0.3, 4, 8]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

/* ─── Premium Glowing Neural Node ─── */
function NeuralNode({ data }: { data: NodeData }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    // Pulsating math based on node object ID for random offsetting
    const randomOffset = parseFloat(data.id) * 10 || Math.random() * 10;
    const t = state.clock.elapsedTime + randomOffset;
    const pulse = Math.sin(t * 3) * 0.5 + 0.5; // 0 to 1

    if (coreRef.current) {
        coreRef.current.scale.setScalar(data.scale * (1 + pulse * 0.2));
    }
    
    if (haloRef.current) {
        haloRef.current.scale.setScalar(data.scale * (2.5 + pulse * 0.8));
        const mat = haloRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.05 + pulse * 0.05;
    }
  });

  return (
    <group position={data.position}>
        {/* Core Node */}
        <mesh ref={coreRef}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={1} roughness={0.2} metalness={0.8} />
        </mesh>
        
        {/* Breathing Halo Effect */}
        <mesh ref={haloRef}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={data.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
    </group>
  );
}

/* ─── The Neural Network Graph Logic ─── */
function NetworkGraph() {
  const groupRef = useRef<THREE.Group>(null!);

  // Generate organic network topology
  const { nodes, connections } = useMemo(() => {
    const nodeArray: NodeData[] = [];
    const connectionArray: ConnectionData[] = [];

    // Defines cluster zones: Inputs (Left), Hidden Layer 1, Hidden Layer 2, Outputs (Right)
    const layers = [
        { count: 12, x: -6, rangeY: 8, rangeZ: 6, color: COLORS.input },
        { count: 18, x: -2, rangeY: 10, rangeZ: 8, color: COLORS.hidden },
        { count: 15, x: 2, rangeY: 8, rangeZ: 6, color: COLORS.hidden },
        { count: 6, x: 6, rangeY: 4, rangeZ: 4, color: COLORS.output },
    ];

    // Generate Nodes
    layers.forEach((layer, layerIdx) => {
        for (let i = 0; i < layer.count; i++) {
            nodeArray.push({
                id: `${layerIdx}-${i}`,
                position: new THREE.Vector3(
                    layer.x + (Math.random() - 0.5) * 2, // Slight x jitter
                    (Math.random() - 0.5) * layer.rangeY,
                    (Math.random() - 0.5) * layer.rangeZ
                ),
                color: layer.color,
                scale: Math.random() * 0.04 + 0.04 // 0.04 to 0.08
            });
        }
    });

    // Generate Connections (Feed-forward logic)
    const getNodesByLayer = (idx: number) => nodeArray.filter(n => n.id.startsWith(`${idx}-`));
    
    for (let layerIdx = 0; layerIdx < layers.length - 1; layerIdx++) {
        const currentLayerNodes = getNodesByLayer(layerIdx);
        const nextLayerNodes = getNodesByLayer(layerIdx + 1);

        currentLayerNodes.forEach((startNode) => {
            // Connect to 3-5 random nodes in the next layer
            const connectionsCount = Math.floor(Math.random() * 3) + 2;
            const shuffledNext = [...nextLayerNodes].sort(() => 0.5 - Math.random());
            
            for (let i = 0; i < connectionsCount; i++) {
                const endNode = shuffledNext[i];
                if (!endNode) continue;

                // Create a smooth cubic bezier curve between nodes
                // The control points are pushed slightly "forward" and offset to create organic swooshes
                const start = startNode.position;
                const end = endNode.position;
                const distance = start.distanceTo(end);

                // Control point offsets
                const cp1 = new THREE.Vector3(
                   start.x + distance * 0.3, 
                   start.y + (Math.random() - 0.5) * 2, 
                   start.z + (Math.random() - 0.5) * 2
                );
                const cp2 = new THREE.Vector3(
                   end.x - distance * 0.3, 
                   end.y + (Math.random() - 0.5) * 2, 
                   end.z + (Math.random() - 0.5) * 2
                );

                connectionArray.push({
                    start,
                    end,
                    color: startNode.color,
                    curve: new THREE.CubicBezierCurve3(start, cp1, cp2, end),
                    pulseSpeed: Math.random() * 0.2 + 0.1, // Random speed
                    pulseOffset: Math.random() * 10 // Random start phase
                });
            }
        });
    }

    return { nodes: nodeArray, connections: connectionArray };
  }, []);

  // GSAP ScrollTrigger Integration to rotate the massive network based on scroll
  useGSAP(() => {
     if (!groupRef.current) return;
     
     // Entire timeline synced to page scroll
     gsap.to(groupRef.current.rotation, {
         y: Math.PI * 0.5,
         x: Math.PI * 0.1,
         ease: "none",
         scrollTrigger: {
             trigger: "body",
             start: "top top",
             end: "bottom bottom",
             scrub: 1 // smooth scrubbing
         }
     });

     gsap.to(groupRef.current.position, {
         z: 4, // move closer to camera
         ease: "none",
         scrollTrigger: {
             trigger: "body",
             start: "top top",
             end: "bottom bottom",
             scrub: 1
         }
     });

  }, []);

  useFrame((state) => {
      // Continuous ambient rotation base
      if (groupRef.current) {
          groupRef.current.rotation.y += 0.001;
      }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            {connections.map((conn, idx) => (
                <CurvedConnection key={`conn-${idx}`} data={conn} />
            ))}
            {nodes.map((node, idx) => (
                <NeuralNode key={`node-${idx}`} data={node} />
            ))}
        </Float>
    </group>
  );
}

/* ─── Main Scene Export ─── */
export default function NeuralNetworkScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#030014", 5, 20]} />
        <ambientLight intensity={0.2} />
        {/* Strong rim lighting for tech feel */}
        <directionalLight position={[10, 10, 5]} intensity={2} color="#8b5cf6" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
        
        <Stars radius={15} depth={50} count={2000} factor={3} fade speed={0.5} />
        
        <NetworkGraph />
      </Canvas>
    </div>
  );
}
