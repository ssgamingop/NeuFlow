"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

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
      hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]
    `,
    secondary: `
      bg-transparent border border-primary/30
      text-primary-light font-medium
      hover:bg-primary/10
      hover:border-primary/50
    `,
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full transition-all duration-300
        ${sizes[size]} ${variants[variant]} ${className}
      `}
    >
      {children}
    </Component>
  );
}
