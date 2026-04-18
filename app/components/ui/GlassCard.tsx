"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "purple" | "cyan" | "pink";
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow,
  delay = 0,
}: GlassCardProps) {
  const glowColors = {
    purple: "hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    cyan: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    pink: "hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={`
        glass rounded-2xl p-6 transition-all duration-300
        ${glow ? glowColors[glow] : ""}
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
