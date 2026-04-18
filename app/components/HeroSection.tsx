"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import GlowButton from "./ui/GlowButton";
import { Sparkles, ArrowRight } from "lucide-react";

const NeuralNetworkScene = dynamic(
  () => import("./3d/NeuralNetworkScene"),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Multi-layer background */}
      <div className="absolute inset-0 bg-[#030014]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.12)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,_rgba(6,182,212,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(244,114,182,0.06)_0%,_transparent_50%)]" />

      {/* 3D Scene */}
      <NeuralNetworkScene />

      {/* Center content overlay — ensures text is always readable */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-x-0 top-[15%] bottom-[10%] bg-[radial-gradient(ellipse_at_center,_rgba(3,0,20,0.7)_0%,_transparent_70%)]" />
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted mb-8 border border-primary/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Interactive AI Learning Platform
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          See How{" "}
          <span className="gradient-text glow-text">AI Thinks</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Learn Artificial Intelligence through immersive visuals, simulations,
          and real-time animations. Stop reading theory —{" "}
          <span className="text-foreground font-medium">start seeing</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GlowButton variant="primary" size="lg" href="#learn">
            <Sparkles className="w-4 h-4" />
            Start Learning
          </GlowButton>
          <GlowButton variant="secondary" size="lg" href="#features">
            Explore Visuals
            <ArrowRight className="w-4 h-4" />
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], height: [4, 8, 4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
