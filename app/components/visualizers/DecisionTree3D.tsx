"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface TreeNode {
  id: string;
  label: string;
  pos: [number, number, number];
  isLeaf?: boolean;
  value?: string;
  color?: string;
  children?: { node: TreeNode; edgeLabel: string }[];
}

const treeData: TreeNode = {
  id: "root",
  label: "Age < 30?",
  pos: [0, 3, 0],
  children: [
    {
      edgeLabel: "Yes",
      node: {
        id: "left",
        label: "Income > $50k?",
        pos: [-3, 1, 0],
        children: [
          {
            edgeLabel: "Yes",
            node: { id: "ll", label: "Buy", pos: [-4, -1, 0], isLeaf: true, color: "#4ade80" }
          },
          {
            edgeLabel: "No",
            node: { id: "lr", label: "Don't Buy", pos: [-2, -1, 0], isLeaf: true, color: "#f87171" }
          }
        ]
      }
    },
    {
      edgeLabel: "No",
      node: {
        id: "right",
        label: "Has Kids?",
        pos: [3, 1, 0],
        children: [
          {
            edgeLabel: "Yes",
            node: { id: "rl", label: "Don't Buy", pos: [2, -1, 0], isLeaf: true, color: "#f87171" }
          },
          {
            edgeLabel: "No",
            node: { id: "rr", label: "Buy", pos: [4, -1, 0], isLeaf: true, color: "#4ade80" }
          }
        ]
      }
    }
  ]
};

function renderTree(node: TreeNode, activeId: string, setActiveId: (id: string) => void) {
  const elements: React.ReactNode[] = [];

  const isActive = activeId === node.id;
  const nodeColor = node.isLeaf ? (node.color || "#ffffff") : (isActive ? "#8b5cf6" : "#0f0f2e");
  const borderColor = node.isLeaf ? nodeColor : (isActive ? "#a78bfa" : "#8b5cf6");

  // Draw node
  elements.push(
    <group key={node.id} position={node.pos}>
      <mesh onClick={() => setActiveId(node.id)}>
        <boxGeometry args={node.isLeaf ? [1.5, 0.8, 0.2] : [2.5, 1, 0.2]} />
        <meshStandardMaterial color={nodeColor} />
      </mesh>
      
      {/* Node border via slightly larger wireframe mesh */}
      <mesh>
        <boxGeometry args={node.isLeaf ? [1.55, 0.85, 0.25] : [2.55, 1.05, 0.25]} />
        <meshBasicMaterial color={borderColor} wireframe />
      </mesh>

      <Html center className="pointer-events-none">
        <div className={`text-[10px] font-bold ${node.isLeaf ? 'text-background' : 'text-white'} whitespace-nowrap`}>
          {node.label}
        </div>
      </Html>
    </group>
  );

  // Draw edges
  if (node.children) {
    node.children.forEach((child) => {
      const childNode = child.node;
      
      // Line from bottom of current node to top of child node
      const start: [number, number, number] = [node.pos[0], node.pos[1] - (node.isLeaf ? 0.4 : 0.5), node.pos[2]];
      const end: [number, number, number] = [childNode.pos[0], childNode.pos[1] + (childNode.isLeaf ? 0.4 : 0.5), childNode.pos[2]];
      const mid: [number, number, number] = [(start[0] + end[0])/2, (start[1] + end[1])/2, (start[2] + end[2])/2];

      elements.push(
        <Line key={`${node.id}-${childNode.id}`} points={[start, end]} color="#ffffff" opacity={0.3} transparent lineWidth={2} />
      );

      elements.push(
        <Html key={`label-${node.id}-${childNode.id}`} position={mid} center className="pointer-events-none">
          <div className="bg-background/80 px-1 py-0.5 rounded text-[8px] font-mono text-muted border border-white/10">
            {child.edgeLabel}
          </div>
        </Html>
      );

      elements.push(...renderTree(childNode, activeId, setActiveId));
    });
  }

  return elements;
}

export default function DecisionTree3D() {
  const [activeId, setActiveId] = useState<string>("root");

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-4 left-4 z-10 glass px-3 py-2 rounded-lg border border-white/10">
        <div className="text-[10px] text-muted font-mono uppercase tracking-widest">Interactive Tree</div>
        <div className="text-xs text-white">Click nodes to traverse</div>
      </div>
      
      <Canvas camera={{ position: [0, 1, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <group position={[0, -1, 0]}>
          {renderTree(treeData, activeId, setActiveId)}
        </group>
        
        <OrbitControls enableZoom={false} maxDistance={12} minDistance={4} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
