"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface GlowButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function GlowButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  href,
}: GlowButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-9 py-4 text-lg",
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-primary to-accent
      text-white font-semibold
      shadow-[0_0_20px_rgba(139,92,246,0.4)]
      hover:shadow-[0_0_40px_rgba(139,92,246,0.6),0_0_80px_rgba(139,92,246,0.2)]
    `,
    secondary: `
      bg-transparent border border-primary/30
      text-primary-light font-medium
      hover:bg-primary/10
      hover:border-primary/50
      hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]
    `,
  };

  // Magnetic hover — button subtly pulls toward cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? "a" : "button";

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.95 }}
      >
        <Component
          href={href || undefined}
          onClick={onClick}
          className={`
            relative overflow-hidden inline-flex items-center justify-center gap-2
            rounded-full transition-all duration-300 cursor-pointer
            ${sizes[size]} ${variants[variant]} ${className}
          `}
        >
          {/* Ripple shine overlay */}
          <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover-shimmer" />
          </span>
          {children}
        </Component>
      </motion.div>
    </div>
  );
}
