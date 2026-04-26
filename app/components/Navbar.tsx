"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "./ui/Logo";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/simulators", label: "Simulators" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(() => {
    if (navRef.current) {
        gsap.fromTo(navRef.current, 
            { y: -100 }, 
            { y: 0, duration: 0.6, ease: "easeOut" }
        );
    }
  }, []);

  // Menu iconic lines animation
  useEffect(() => {
      if (mobileOpen) {
          gsap.to(line1Ref.current, { rotate: 45, y: 6, duration: 0.3 });
          gsap.to(line2Ref.current, { opacity: 0, duration: 0.2 });
          gsap.to(line3Ref.current, { rotate: -45, y: -6, duration: 0.3 });
      } else {
          gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.3 });
          gsap.to(line2Ref.current, { opacity: 1, duration: 0.2 });
          gsap.to(line3Ref.current, { rotate: 0, y: 0, duration: 0.3 });
      }
  }, [mobileOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/60 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      {/* Bottom glow line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
             <Logo className="w-full h-full" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Neu<span className="gradient-text">Flow</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors duration-200 relative group py-1"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <Link
            href="/lesson/what-is-ai"
            className="text-sm px-5 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105"
          >
            Start Learning
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span ref={line1Ref} className="block w-6 h-[2px] bg-foreground origin-center" />
          <span ref={line2Ref} className="block w-6 h-[2px] bg-foreground" />
          <span ref={line3Ref} className="block w-6 h-[2px] bg-foreground origin-center" />
        </button>
      </div>

      {/* Mobile Menu - Only keeping AnimatePresence for clean unmounting */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-xl border-t border-primary/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/lesson/what-is-ai"
                onClick={() => setMobileOpen(false)}
                className="text-center px-5 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium"
              >
                Start Learning
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
