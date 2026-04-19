"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState, useRef } from "react";
import { Brain, TrendingDown } from "lucide-react";
import Navbar from "../components/Navbar";
import dynamic from "next/dynamic";

const GradientDescentSimulator = dynamic(
  () => import("../components/simulators/GradientDescentSimulator"),
  { ssr: false }
);
const NeuralNetworkSimulator = dynamic(
  () => import("../components/simulators/NeuralNetworkSimulator"),
  { ssr: false }
);

const tabs = [
  {
    id: "gradient-descent",
    label: "Gradient Descent",
    Icon: TrendingDown,
    color: "#22d3ee",
    description:
      "Visualize how models find the optimal solution by following the slope of the error landscape. Adjust the learning rate and watch convergence in real-time.",
  },
  {
    id: "neural-network",
    label: "Neural Network",
    Icon: Brain,
    color: "#8b5cf6",
    description:
      "Watch data flow through a 3D neural network. Adjust inputs, add hidden neurons, and observe forward propagation step by step.",
  },
];

export default function SimulatorsPage() {
  const [activeTab, setActiveTab] = useState("gradient-descent");
  const pageRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header
    gsap.fromTo(".sim-header",
       { opacity: 0, y: 30 },
       { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    // Tabs
    gsap.fromTo(".sim-tab",
       { opacity: 0, y: 20 },
       { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
    );
  }, { scope: pageRef });

  // Animate simulator switch
  useGSAP(() => {
      gsap.fromTo(".sim-content", 
         { opacity: 0, y: 20 },
         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
  }, { dependencies: [activeTab], scope: containerRef });

  return (
    <>
      <Navbar />
      <main ref={pageRef} className="min-h-screen pt-24 pb-20">
        {/* Background */}
        <div className="fixed inset-0 -z-10 hero-bg" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06)_0%,_transparent_60%)]" />

        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="sim-header text-center mb-12 opacity-0">
            <span className="text-sm text-neon-pink font-medium tracking-widest uppercase mb-4 block">
              Hands-On Tools
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Interactive <span className="gradient-text">Simulators</span>
            </h1>
            <p className="text-muted max-w-lg mx-auto text-lg">
              Tweak parameters and watch AI in action. No code required.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sim-tab opacity-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 ${
                  activeTab === tab.id
                    ? "bg-primary/15 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    : "text-muted hover:text-foreground hover:bg-surface-light border border-transparent"
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div ref={containerRef}>
              {/* Active simulator description */}
              <p className="sim-content opacity-0 text-muted text-center text-sm mb-8 max-w-lg mx-auto">
                {tabs.find((t) => t.id === activeTab)?.description}
              </p>

              {/* Simulator */}
              <div className="sim-content opacity-0">
                {activeTab === "gradient-descent" ? (
                  <GradientDescentSimulator />
                ) : (
                  <NeuralNetworkSimulator />
                )}
              </div>
          </div>
        </div>
      </main>
    </>
  );
}
