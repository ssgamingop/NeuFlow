"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import GlowButton from "./ui/GlowButton";
import DataFlowCanvas from "./DataFlowCanvas";
import { Sparkles, ArrowRight } from "lucide-react";

const NeuralNetworkScene = dynamic(
  () => import("./3d/NeuralNetworkScene"),
  { ssr: false }
);

/* ─── Mouse-following cursor glow ─── */
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[2]"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
      }}
    />
  );
}

/* ─── Interactive gradient text that responds to mouse ─── */
function InteractiveTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <h1
      ref={ref}
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
    >
      See How{" "}
      <span
        className="inline-block"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #c084fc, #8b5cf6, #06b6d4, #f472b6)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 30px rgba(139,92,246,0.4))",
        }}
      >
        AI Thinks
      </span>
    </h1>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax: hero zooms out and fades as user scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Multi-layer background */}
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.15)_0%,_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,_rgba(6,182,212,0.08)_0%,_transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(244,114,182,0.06)_0%,_transparent_45%)]" />

      {/* 3D Neural Network */}
      <NeuralNetworkScene />

      {/* Data flow canvas overlay */}
      <DataFlowCanvas />

      {/* Cursor-following glow */}
      <CursorGlow />

      {/* Readability overlay behind center text */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div className="absolute inset-x-0 top-[10%] bottom-[5%] bg-[radial-gradient(ellipse_60%_50%_at_center,_rgba(3,0,20,0.75)_0%,_transparent_100%)]" />
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent z-[4]" />

      {/* Content — scrolls with parallax */}
      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="relative z-[5] text-center px-6 max-w-4xl mx-auto"
      >
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

        {/* Interactive title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <InteractiveTitle />
        </motion.div>

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
          <GlowButton variant="primary" size="lg" href="/roadmap">
            <Sparkles className="w-4 h-4" />
            Start Learning
          </GlowButton>
          <GlowButton variant="secondary" size="lg" href="/simulators">
            Explore Visuals
            <ArrowRight className="w-4 h-4" />
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16"
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
      </motion.div>
    </section>
  );
}
