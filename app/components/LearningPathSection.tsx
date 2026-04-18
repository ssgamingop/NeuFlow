"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Bot, BarChart3, Brain, Sparkles } from "lucide-react";

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

  return (
    <section id="roadmap" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
        </motion.div>

        {/* Skill Tree */}
        <div className="relative h-[400px] md:h-[350px]">
          {/* Connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
          >
            {pathNodes.slice(0, -1).map((node, i) => {
              const next = pathNodes[i + 1];
              return (
                <motion.line
                  key={i}
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="url(#lineGradient)"
                  strokeWidth="0.3"
                  strokeDasharray="2 1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 * i, duration: 1 }}
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
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * i, duration: 0.5, type: "spring" }}
              className="absolute group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow ring */}
              <motion.div
                animate={
                  hoveredNode === node.id
                    ? { scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }
                    : { scale: 1, opacity: 0.15 }
                }
                transition={{ duration: 2, repeat: hoveredNode === node.id ? Infinity : 0 }}
                className="absolute inset-[-12px] rounded-full"
                style={{ backgroundColor: `${node.color}30` }}
              />

              {/* Node */}
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl glass flex items-center justify-center cursor-pointer transition-all duration-300"
                style={{
                  borderColor: hoveredNode === node.id ? node.color : "rgba(139,92,246,0.15)",
                  boxShadow: hoveredNode === node.id ? `0 0 30px ${node.color}40` : "none",
                }}
              >
                <node.Icon
                  className="w-7 h-7 md:w-8 md:h-8"
                  style={{ color: node.color }}
                />
              </motion.div>

              {/* Label */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                <p className="text-sm font-semibold text-foreground">
                  {node.label}
                </p>
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={
                    hoveredNode === node.id
                      ? { opacity: 1, height: "auto" }
                      : { opacity: 0, height: 0 }
                  }
                  className="text-xs text-muted max-w-[140px] mx-auto mt-1"
                >
                  {node.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
