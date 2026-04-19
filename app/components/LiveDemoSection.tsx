"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Play, RotateCcw, Layers } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const demoTokens = ["Hello", " ", "AI", ",", " how", " do", " you", " think", "?"];
const demoOutput = "I process your words through layers of neural networks, transforming tokens into meaning through attention mechanisms...";

/* ─── 3D Transformer Layout Component ─── */
function Transformer3DLayer({ index, activeState }: { index: number, activeState: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const layerColors = ["#8b5cf6", "#a78bfa", "#06b6d4", "#22d3ee", "#f472b6"];
  const color = layerColors[index];

  useFrame((state) => {
      // Idle slow pulsing
      if (activeState === "idle" || activeState === "tokenizing") {
          const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
          (meshRef.current.material as THREE.MeshPhysicalMaterial).opacity = 0.2 + pulse;
      }
  });

  return (
      <mesh ref={meshRef} position={[0, -index * 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          {/* Glassy physical material */}
          <meshPhysicalMaterial 
             color={color} 
             transparent 
             opacity={0.2} 
             roughness={0.1}
             metalness={0.8}
             transmission={0.9} 
             thickness={0.5}
             side={THREE.DoubleSide}
          />
          {/* Glowing wireframe border */}
          <lineSegments>
             <edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(4, 4)]} />
             <lineBasicMaterial attach="material" color={color} transparent opacity={0.6} />
          </lineSegments>
      </mesh>
  );
}

function TransformerCore({ activeState }: { activeState: string }) {
   const beamRef = useRef<THREE.Mesh>(null!);
   const layerGroupRef = useRef<THREE.Group>(null!);

   // The processing animation sequence
   useEffect(() => {
       if (activeState === "processing") {
           const tl = gsap.timeline();
           
           // Pulse layers sequentially
           for(let i=0; i<5; i++) {
               const mesh = layerGroupRef.current.children[i] as THREE.Mesh;
               tl.to(mesh.material, { opacity: 0.8, duration: 0.2, ease: "power2.in" })
                 .to(mesh.material, { opacity: 0.2, duration: 0.4, ease: "power2.out" });
           }

           // Simultaneously, a light beam traverses through
           tl.fromTo(beamRef.current.position, 
              { y: 1 }, 
              { y: -7, duration: 1.5, ease: "power1.inOut" },
              0 // Start at beginning of timeline
           );
           tl.to((beamRef.current.material as THREE.Material), { opacity: 0.8, duration: 0.2 }, 0);
           tl.to((beamRef.current.material as THREE.Material), { opacity: 0, duration: 0.3 }, 1.3); // Fade out at end
       } else {
           if (beamRef.current) (beamRef.current.material as THREE.Material).opacity = 0;
       }
   }, [activeState]);

   return (
       <group position={[0, 3, 0]}>
           <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
               <group ref={layerGroupRef}>
                   {[0, 1, 2, 3, 4].map(idx => (
                       <Transformer3DLayer key={idx} index={idx} activeState={activeState} />
                   ))}
               </group>

               {/* Traversing Data Beam */}
               <mesh ref={beamRef} position={[0, 1, 0]}>
                   <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
                   <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} />
               </mesh>
           </Float>
       </group>
   );
}


/* ─── Main Demo Component ─── */
export default function LiveDemoSection() {
  const [stage, setStage] = useState<"idle" | "tokenizing" | "processing" | "output">("idle");
  const [visibleTokens, setVisibleTokens] = useState<number>(0);
  const [outputText, setOutputText] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP();

  useGSAP(() => {
    // Header ScrollTrigger
    gsap.fromTo(".demo-header", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
    );
    
    // Feature Box Entrance
    gsap.fromTo(".demo-box",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".demo-box", start: "top 80%" } }
    );
  }, { scope: sectionRef });

  const runDemo = useCallback(() => {
    if (hasPlayed) {
      setStage("idle");
      setVisibleTokens(0);
      setOutputText("");
      setHasPlayed(false);
      return;
    }

    setStage("tokenizing");
    setVisibleTokens(0);

    let tokenIdx = 0;
    const tokenInterval = setInterval(() => {
      tokenIdx++;
      setVisibleTokens(tokenIdx);
      if (tokenIdx >= demoTokens.length) {
        clearInterval(tokenInterval);
        
        setTimeout(() => {
          setStage("processing"); // Triggers the 3D WebGL animation loop
          
          setTimeout(() => {
             setStage("output");
             let charIdx = 0;
             const typeInterval = setInterval(() => {
               charIdx++;
               setOutputText(demoOutput.slice(0, charIdx));
               if (charIdx >= demoOutput.length) {
                  clearInterval(typeInterval);
                  setHasPlayed(true);
               }
             }, 20);
          }, 1600); // Wait for the 3D GSAP beam to traverse

        }, 500);
      }
    }, 120);
  }, [hasPlayed]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#080820] to-background" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="demo-header text-center mb-12 opacity-0">
          <span className="text-sm text-neon-cyan font-medium tracking-widest uppercase mb-4 block">
            Try It Now
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Watch AI <span className="gradient-text">Process</span> in
            Real-Time
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Click the button below and see a live simulation of how a language
            model transforms your input into output.
          </p>
        </div>

        {/* Demo Layout */}
        <div className="demo-box opacity-0 glass-strong rounded-3xl p-6 md:p-8 grid lg:grid-cols-[1fr_350px] gap-8 border border-primary/20">
          
          {/* Left Column: UI Flow */}
          <div className="flex flex-col h-full">
              {/* Input */}
              <div className="mb-6">
                 <p className="text-xs text-muted mb-2 uppercase tracking-wider">Input Prompt</p>
                 <div className="glass rounded-xl p-4 font-mono text-lg text-foreground bg-primary/5">
                    Hello AI, how do you think?
                    <span className="animate-pulse text-primary ml-1">|</span>
                 </div>
              </div>

              {/* Tokens */}
              <div className={`transition-all duration-500 overflow-hidden ${stage !== "idle" ? "opacity-100 mb-6" : "opacity-0 h-0"}`}>
                 <p className="text-xs text-muted mb-2 uppercase tracking-wider">Tokenization Vector</p>
                 <div className="flex flex-wrap gap-2">
                    {demoTokens.map((token, i) => (
                       <span
                         key={i}
                         className={`px-3 py-1.5 rounded-lg border text-sm font-mono transition-all duration-300 ${
                            i < visibleTokens ? "opacity-100 scale-100 bg-primary/15 border-primary/25 text-primary-light" : "opacity-0 scale-90 border-transparent bg-transparent"
                         }`}
                       >
                         {token === " " ? "⎵" : token}
                       </span>
                    ))}
                 </div>
              </div>

              <div className="flex-grow" />

              {/* Output terminal */}
              <div className={`transition-all duration-500 overflow-hidden ${stage === "output" || hasPlayed ? "opacity-100 mt-6" : "opacity-0 h-0"}`}>
                 <p className="text-xs text-muted mb-2 uppercase tracking-wider">Generated Response</p>
                 <div className="glass rounded-xl p-4 text-accent-light font-mono text-sm leading-relaxed min-h-[80px] bg-accent/5">
                    {outputText}
                    {outputText.length > 0 && outputText.length < demoOutput.length && (
                       <span className="animate-pulse inline-block ml-1">▊</span>
                    )}
                 </div>
              </div>

              {/* Actions */}
              <div className="mt-8 relative z-10 flex justify-start">
                  <button
                    onClick={runDemo}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] active:scale-95 transition-all duration-300"
                  >
                    {hasPlayed ? (
                       <><RotateCcw className="w-4 h-4" /> Reset</>
                    ) : stage === "idle" ? (
                       <><Play className="w-4 h-4" /> Evaluate Model</>
                    ) : (
                       <><Layers className="w-4 h-4 animate-spin" /> Processing...</>
                    )}
                  </button>
              </div>
          </div>

          {/* Right Column: 3D Visualization Canvas */}
          <div className="w-full h-[300px] lg:h-[400px] glass rounded-2xl relative overflow-hidden bg-[#030010]">
              <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
                 <ambientLight intensity={0.5} />
                 <directionalLight position={[10, 10, 10]} intensity={1} color="#c084fc" />
                 <TransformerCore activeState={stage} />
                 <OrbitControls enableZoom={false} enablePan={false} autoRotate={stage === "idle"} autoRotateSpeed={1.5} maxPolarAngle={Math.PI / 2.2} />
              </Canvas>
              
              {/* Overlay Tags */}
              <div className="absolute top-3 right-3 text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary/80">Active Model</p>
                  <p className="text-xs font-mono text-muted">Transformer-N v2.1</p>
              </div>

              {stage === "processing" && (
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary/20 border border-primary/40 text-primary-light text-xs font-mono px-3 py-1 rounded-full animate-pulse whitespace-nowrap">
                       Traversing Attention Layers
                    </span>
                 </div>
              )}
          </div>

        </div>
      </div>
    </section>
  );
}
