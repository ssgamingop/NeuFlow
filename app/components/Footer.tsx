"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="text-lg font-bold">
              Neu<span className="gradient-text">Flow</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#simulators" className="hover:text-foreground transition-colors">Simulators</a>
            <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} NeuFlow. Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
