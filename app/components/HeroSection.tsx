"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import GlowButton from "./ui/GlowButton";
import { Sparkles, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NeuralNetworkScene = dynamic(
  () => import("./3d/NeuralNetworkScene"),
  { ssr: false }
);

/* ─── Mouse-following cursor glow ─── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      // Use gsap quickTo for ultra-performant cursor following
      gsap.to(ref.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[2]"
      style={{
        transform: "translate(-50%, -50%)",
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
        className="inline-block relative"
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
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Staggered Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
    
    tl.fromTo(".hero-stagger", 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, delay: 0.2 }
    );

    // 2. Scroll Parallax Effect
    gsap.to(contentRef.current, {
        scale: 0.85,
        opacity: 0,
        y: -100,
        ease: "none",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });

  }, { scope: sectionRef });

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

      {/* Cursor-following glow */}
      <CursorGlow />

      {/* Readability overlay behind center text */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div className="absolute inset-x-0 top-[10%] bottom-[5%] bg-[radial-gradient(ellipse_60%_50%_at_center,_rgba(3,0,20,0.75)_0%,_transparent_100%)]" />
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent z-[4]" />

      {/* Content — scrolls with parallax */}
      <div
        ref={contentRef}
        className="relative z-[5] text-center px-6 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <div className="hero-stagger inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted mb-8 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Interactive AI Learning Platform
        </div>

        {/* Interactive title */}
        <div className="hero-stagger relative">
          <InteractiveTitle />
        </div>

        {/* Subtitle */}
        <p className="hero-stagger text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Learn Artificial Intelligence through immersive visuals, simulations,
          and real-time animations. Stop reading theory —{" "}
          <span className="text-foreground font-medium">start seeing</span>.
        </p>

        {/* CTA Buttons */}
        <div className="hero-stagger flex flex-col sm:flex-row items-center justify-center gap-4">
          <GlowButton variant="primary" size="lg" href="/roadmap">
            <Sparkles className="w-4 h-4" />
            Start Learning
          </GlowButton>
          <GlowButton variant="secondary" size="lg" href="/simulators">
            Explore Visuals
            <ArrowRight className="w-4 h-4" />
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
