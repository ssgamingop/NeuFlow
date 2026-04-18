"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  Hash,
  Box,
  Brain,
  Zap,
} from "lucide-react";

const pipelineSteps = [
  { Icon: FileText, label: "Text Input", color: "#8b5cf6", desc: "Raw user prompt" },
  { Icon: Hash, label: "Tokenization", color: "#a78bfa", desc: "Split into tokens" },
  { Icon: Box, label: "Embeddings", color: "#06b6d4", desc: "Numerical vectors" },
  { Icon: Brain, label: "Attention", color: "#22d3ee", desc: "Context mapping" },
  { Icon: Zap, label: "Output", color: "#f472b6", desc: "Generated response" },
];

export default function AiNotMagicSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={ref}
      className="section-padding relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
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
        </motion.div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: explanation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">
                From Words to Understanding
              </h3>
              <p className="text-muted leading-relaxed mb-6">
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary flex-shrink-0 font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: animated pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            {pipelineSteps.map((step, i) => (
              <div key={i} className="w-full max-w-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ delay: 0.2 * i, duration: 0.5 }}
                  className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-primary/40 transition-all duration-300"
                  style={{
                    borderColor: `${step.color}20`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
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
                  <div className="ml-auto">
                    <motion.div
                      animate={
                        isInView
                          ? {
                              scale: [1, 1.4, 1],
                              opacity: [0.3, 0.8, 0.3],
                            }
                          : {}
                      }
                      transition={{
                        delay: 0.2 * i + 0.5,
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>
                </motion.div>

                {/* Arrow connector */}
                {i < pipelineSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.2 * i + 0.3 }}
                    className="flex justify-center py-1"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      className="text-primary/30"
                    >
                      <path
                        d="M10 4 L10 14 M6 10 L10 14 L14 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
