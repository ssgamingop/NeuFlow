"use client";

import { useRef, useEffect } from "react";
import { FileText, Hash, Box, Brain, Zap } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sphere, Torus, Line } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pipelineSteps = [
  { Icon: FileText, label: "Text Input", color: "#8b5cf6", desc: "Raw user prompt" },
  { Icon: Hash, label: "Tokenization", color: "#a78bfa", desc: "Split into tokens" },
  { Icon: Box, label: "Embeddings", color: "#06b6d4", desc: "Numerical vectors" },
  { Icon: Brain, label: "Attention", color: "#22d3ee", desc: "Context mapping" },
  { Icon: Zap, label: "Output", color: "#f472b6", desc: "Generated response" },
];

function InteractiveCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Scroll synced rotation via useFrame reading the document scroll
  useFrame((state) => {
    if (coreRef.current && ringRef.current) {
        coreRef.current.rotation.y += 0.005;
        coreRef.current.rotation.x += 0.002;
        ringRef.current.rotation.x -= 0.01;
        ringRef.current.rotation.y -= 0.005;
    }
    if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.001;
    }
  });

  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  for(let i=0; i<particleCount*3; i++) {
      positions[i] = (Math.random() - 0.5) * 8;
  }

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#06b6d4" />
      <directionalLight position={[-5, -5, -5]} intensity={2} color="#8b5cf6" />
      
      {/* Outer Data Ring */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
         <Torus ref={ringRef} args={[2.5, 0.02, 16, 100]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} toneMapped={false} />
         </Torus>
      </Float>

      {/* Central Processing Core */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
          <Sphere ref={coreRef} args={[1.2, 64, 64]}>
             <meshPhysicalMaterial 
               color="#030014" 
               emissive="#8b5cf6"
               emissiveIntensity={0.5}
               roughness={0.1}
               transmission={0.9} 
               thickness={2}
               clearcoat={1}
               wireframe={true}
               transparent
             />
          </Sphere>
      </Float>

      {/* Neural Particles */}
      <points ref={particlesRef}>
         <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
         </bufferGeometry>
         <pointsMaterial size={0.05} color="#f472b6" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
      
      <Environment preset="city" />
    </group>
  );
}

export default function AiNotMagicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useGSAP(() => {
    // Header Entrance
    gsap.fromTo(".magic-header",
       { opacity: 0, y: 30 },
       { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
    );

    // Left Panel Explanation Texts Stagger
    gsap.fromTo(".magic-text-block", 
       { opacity: 0, x: -30 },
       { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: ".magic-text-block", start: "top 80%" } }
    );

    // Build timeline to sync pipeline nodes with scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".pipeline-container",
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
        }
    });

    pipelineSteps.forEach((_, i) => {
        const nodeStr = `.pipeline-node-${i}`;
        tl.fromTo(nodeStr, 
           { opacity: 0.2, x: 50, scale: 0.9 },
           { opacity: 1, x: 0, scale: 1, duration: 1, ease: "back.out(1.5)", borderLeftColor: "#8b5cf6" }
        , i * 0.5); // overlapping staggers along scroll scrub
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="features" className="section-padding relative overflow-hidden min-h-screen flex items-center">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[#030014] -z-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 3D Canvas Background fixed to this section */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-60 lg:opacity-100 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
             <InteractiveCore />
          </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section header */}
        <div className="magic-header text-center lg:text-left mb-16 opacity-0">
          <span className="text-sm text-accent font-mono tracking-widest uppercase mb-4 block drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            Deconstructing Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            AI is <span className="gradient-text drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">Not Magic</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Every massive neural network follows a rigid, calculable pipeline. We isolate the architecture step-by-step so you can see exactly how human concepts physically transform into digital intelligence.
          </p>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Interactive pipeline nodes */}
          <div className="pipeline-container flex flex-col gap-4 relative">
             {/* Glowing connector line behind nodes */}
             <div className="absolute left-[35px] top-[40px] bottom-[40px] w-[2px] bg-gradient-to-b from-primary/20 via-accent/20 to-neon-pink/20 -z-10" />

            {pipelineSteps.map((step, i) => (
              <div
                key={i}
                className={`pipeline-node-${i} glass-strong rounded-2xl p-5 flex items-center gap-5 border-l-4 border-white/5 opacity-20`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                  style={{ backgroundColor: `${step.color}10` }}
                >
                  <step.Icon
                    className="w-6 h-6"
                    style={{ color: step.color, filter: `drop-shadow(0 0 8px ${step.color})` }}
                  />
                </div>
                <div>
                  <p className="font-bold text-lg text-white font-mono tracking-tight">
                    {step.label}
                  </p>
                  <p className="text-sm text-muted mt-1">{step.desc}</p>
                </div>
                
                {/* Active Indicator Pulse */}
                <div className="ml-auto w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: step.color }} />
              </div>
            ))}
          </div>

          {/* Right: Explanation (Over the 3D Canvas) */}
          <div className="space-y-6 lg:pl-12">
            <div className="glass-strong rounded-3xl p-8 lg:p-10 border border-primary/20 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 blur-[60px] pointer-events-none" />
              <h3 className="magic-text-block opacity-0 text-3xl font-bold mb-6 text-white tracking-tight">
                From Words to Vectors
              </h3>
              <p className="magic-text-block opacity-0 text-muted leading-relaxed mb-8 text-lg">
                When you submit a prompt, the machine doesn't read English. It translates your text into high-dimensional physical space. Millions of parameters interact as light across a silicon grid.
              </p>
              
              <div className="space-y-5">
                {[
                  "Text is shattered into sub-word tokens",
                  "Tokens map to precise n-dimensional coordinates",
                  "Self-Attention calculates contextual gravity",
                  "Predictions collapse into the highest probability",
                ].map((step, i) => (
                  <div key={i} className="magic-text-block opacity-0 flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      {i + 1}
                    </span>
                    <span className="text-[15px] font-medium text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
