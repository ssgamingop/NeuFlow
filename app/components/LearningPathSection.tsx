"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, BarChart3, Brain, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pathNodes = [
  {
    id: "ai-basics",
    label: "AI Basics",
    description: "What is intelligence? How do machines learn?",
    Icon: Bot,
    color: "#8b5cf6",
    x: 15,
    y: 20,
  },
  {
    id: "ml",
    label: "Machine Learning",
    description: "Supervised, unsupervised, and reinforcement learning.",
    Icon: BarChart3,
    color: "#a78bfa",
    x: 40,
    y: 35,
  },
  {
    id: "dl",
    label: "Deep Learning",
    description: "Neural networks with multiple hidden layers.",
    Icon: Brain,
    color: "#06b6d4",
    x: 60,
    y: 18,
  },
  {
    id: "llm",
    label: "LLMs",
    description: "Transformers, attention, and language models.",
    Icon: Sparkles,
    color: "#22d3ee",
    x: 80,
    y: 40,
  },
];

export default function LearningPathSection() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP();

  useGSAP(() => {
    // Header ScrollTrigger
    gsap.fromTo(
      ".path-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );

    // Nodes Stagger Animation
    gsap.fromTo(
      ".path-node",
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".path-svg-container",
          start: "top 80%",
        },
      }
    );

    // SVG Lines Draw Effect using strokeDasharray trick
    const lines = document.querySelectorAll('.path-connection-line');
    lines.forEach((line, i) => {
        gsap.fromTo(line, 
           { strokeDashoffset: 100 }, // assuming pathLength roughly 100 in viewbox 0 0 100 60
           {
               strokeDashoffset: 0,
               duration: 1,
               delay: i * 0.3, // Sequential drawing
               scrollTrigger: {
                   trigger: ".path-svg-container",
                   start: "top 80%",
               }
           }
        );
    });

  }, { scope: sectionRef });

  const handleHover = contextSafe((nodeId: string | null) => {
      setHoveredNode(nodeId);
      
      if (nodeId) {
          gsap.to(`.node-core-${nodeId}`, { scale: 1.15, duration: 0.3, ease: "back.out(1.5)" });
          gsap.to(`.node-desc-${nodeId}`, { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" });
      } else {
          gsap.to(".node-core", { scale: 1, duration: 0.3, ease: "power2.out" });
          gsap.to(".node-desc", { opacity: 0, height: 0, duration: 0.3, ease: "power2.out" });
      }
  });

  return (
    <section ref={sectionRef} id="roadmap" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="path-header text-center mb-16 opacity-0">
          <span className="text-sm text-neon-pink font-medium tracking-widest uppercase mb-4 block">
            Your Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Learning <span className="gradient-text">Path</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-lg">
            Follow a structured journey from AI fundamentals to building your
            own language models.
          </p>
        </div>

        {/* Skill Tree */}
        <div className="path-svg-container relative h-[400px] md:h-[350px]">
          {/* Connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
          >
            {pathNodes.slice(0, -1).map((node, i) => {
              const next = pathNodes[i + 1];
              return (
                <line
                  key={i}
                  className="path-connection-line"
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="url(#lineGradient)"
                  strokeWidth="0.3"
                  strokeDasharray="100" // Arbitrary large enough to cover the line
                  style={{ strokeDashoffset: "100" }} // Hidden initially via style
                />
              );
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Nodes */}
          {pathNodes.map((node, i) => (
            <div
              key={node.id}
              className="path-node absolute group opacity-0 scale-0"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => handleHover(node.id)}
              onMouseLeave={() => handleHover(null)}
            >
              {/* Glow ring */}
              <div
                className="absolute inset-[-12px] rounded-full transition-all duration-500"
                style={{ 
                    backgroundColor: `${node.color}30`,
                    transform: hoveredNode === node.id ? "scale(1.2)" : "scale(1)",
                    opacity: hoveredNode === node.id ? 0.4 : 0.15
                }}
              />

              {/* Node Core */}
              <div
                className={`node-core node-core-${node.id} relative w-16 h-16 md:w-20 md:h-20 rounded-2xl glass flex items-center justify-center cursor-pointer transition-colors duration-300`}
                style={{
                  borderColor: hoveredNode === node.id ? node.color : "rgba(139,92,246,0.15)",
                  boxShadow: hoveredNode === node.id ? `0 0 30px ${node.color}40` : "none",
                }}
              >
                <node.Icon
                  className="w-7 h-7 md:w-8 md:h-8"
                  style={{ color: node.color }}
                />
              </div>

              {/* Label */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                <p className="text-sm font-semibold text-foreground">
                  {node.label}
                </p>
                <p
                  className={`node-desc node-desc-${node.id} text-xs text-muted max-w-[140px] mx-auto mt-1 opacity-0 h-0 overflow-hidden`}
                >
                  {node.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
