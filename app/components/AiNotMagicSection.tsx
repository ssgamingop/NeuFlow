"use client";

import { useRef } from "react";
import { FileText, Hash, Box, Brain, Zap } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pipelineSteps = [
  { Icon: FileText, label: "Text Input", color: "#8b5cf6", desc: "Raw user prompt" },
  { Icon: Hash, label: "Tokenization", color: "#a78bfa", desc: "Split into tokens" },
  { Icon: Box, label: "Embeddings", color: "#06b6d4", desc: "Numerical vectors" },
  { Icon: Brain, label: "Attention", color: "#22d3ee", desc: "Context mapping" },
  { Icon: Zap, label: "Output", color: "#f472b6", desc: "Generated response" },
];

export default function AiNotMagicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP();

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

    // Right Panel Interactive Pipeline Timeline (Scrubbed with Scroll)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".pipeline-container",
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1, // Smooth scrub
        }
    });

    // Animate pipeline nodes lighting up sequentially based on scroll depth
    pipelineSteps.forEach((_, i) => {
        const nodeStr = `.pipeline-node-${i}`;
        const arrowStr = `.pipeline-arrow-${i}`; // Arrow going to next node
        
        // Node lights up
        tl.fromTo(nodeStr, 
           { opacity: 0.3, scale: 0.95, borderColor: "rgba(255,255,255,0.05)" },
           { opacity: 1, scale: 1, borderColor: "rgba(139,92,246,0.3)", duration: 1 }
        );

        // Arrow fills in
        if (i < pipelineSteps.length - 1) {
            tl.fromTo(arrowStr,
              { strokeDashoffset: 20 }, // Assuming we draw it
              { strokeDashoffset: 0, opacity: 1, duration: 0.8 }
            );
        }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="features" className="section-padding relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="magic-header text-center mb-16 opacity-0">
          <span className="text-sm text-accent font-medium tracking-widest uppercase mb-4 block">
            Demystified
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            AI is <span className="gradient-text">Not Magic</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Every AI model follows a clear, logical pipeline. We break it down
            step by step — so you can see exactly how data transforms into
            intelligence.
          </p>
        </div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: explanation */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-8">
              <h3 className="magic-text-block opacity-0 text-2xl font-semibold mb-4">
                From Words to Understanding
              </h3>
              <p className="magic-text-block opacity-0 text-muted leading-relaxed mb-6">
                When you type a prompt, it doesn&apos;t go straight to the AI.
                Your words travel through multiple transformation layers — each
                one extracting deeper meaning.
              </p>
              <div className="space-y-4">
                {[
                  "Text is split into smaller pieces called tokens",
                  "Each token gets a numerical identity (embedding)",
                  "Attention mechanisms find relationships between tokens",
                  "The model predicts the most likely next tokens",
                ].map((step, i) => (
                  <div key={i} className="magic-text-block opacity-0 flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary flex-shrink-0 font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: animated pipeline */}
          <div className="pipeline-container flex flex-col items-center gap-2">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="w-full max-w-sm flex flex-col items-center">
                <div
                  className={`pipeline-node-${i} glass rounded-xl p-4 flex w-full items-center gap-4 group transition-colors duration-300`}
                  style={{ opacity: 0.3, scale: 0.95 }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <step.Icon
                      className="w-5 h-5"
                      style={{ color: step.color }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {step.label}
                    </p>
                    <p className="text-xs text-muted">{step.desc}</p>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="ml-auto flex items-center justify-center w-6 h-6">
                     <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: step.color }} />
                  </div>
                </div>

                {/* Arrow connector */}
                {i < pipelineSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="text-primary/50"
                    >
                      <path
                        className={`pipeline-arrow-${i}`}
                        d="M12 4 L12 20 M6 14 L12 20 L18 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="20"
                        strokeDashoffset="20" // Pre-GSAP state
                        opacity={0} // Pre-GSAP state
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
